import { GeneratedImageI, LayerBuffersI } from "@controllers/generateArt";
import { AttributeI, TokenT } from "@models/collection";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { s3 } from "./common";

interface LayerQI {
  [key: string]: number;
  total: number;
}

export interface LayersQI {
  [key: string]: LayerQI;
}

const updateLayerQuantities = (
  layerName: string,
  imgName: string,
  quantities: LayersQI
) => {
  let layer: LayerQI | undefined;
  if (quantities[layerName]) {
    layer = quantities[layerName];
  } else {
    quantities[layerName] = { total: 0 };
    layer = quantities[layerName];
  }

  if (layer) {
    if (layer[imgName]) {
      layer[imgName]++;
      layer.total++;
    } else {
      layer[imgName] = 1;
      layer.total++;
    }
  }
};

function createSharpImg(
  generatedImage: GeneratedImageI,
  layerQuantities: LayersQI,
  layerBuffers: LayerBuffersI,
  composites: sharp.OverlayOptions[]
) {
  let resultImage: sharp.Sharp | undefined;
  generatedImage.images.forEach(([layerIndex, layerName, imgName], index) => {
    updateLayerQuantities(layerName, imgName, layerQuantities);

    const buffer = layerBuffers[layerName]?.[layerIndex];
    if (index) {
      composites.push({ input: buffer });
    } else {
      resultImage = sharp(buffer);
    }
  });

  if (!resultImage) {
    throw new Error("Cannot compile image when none is given");
  }
  return resultImage;
}

interface S3UploadI {
  Bucket: string;
  Key: string;
  ACL: string;
  Body?: Buffer;
}

interface UploadI {
  key: string;
  filePath: string;
  uploadParams: S3UploadI;
}

const getUploadInfo = (
  creator: string,
  name: string,
  index: number
): UploadI => {
  const key = `${creator}/${name}/images/${index}.png`;
  return {
    key,
    filePath: path.resolve(__dirname, `./${index}.png`),
    uploadParams: {
      Bucket: "nft-toolkit-collections",
      Key: key,
      ACL: "public-read",
    },
  };
};

function combineImages(
  resultImage: sharp.Sharp,
  composites: sharp.OverlayOptions[],
  filePath: string
): Promise<sharp.OutputInfo> {
  return resultImage
    .composite(composites)
    .toFormat("png", { quality: 80 })
    .toFile(filePath);
}

const createTokenMetadata = (
  name: string,
  index: number,
  key: string,
  attrs: AttributeI[]
): TokenT => {
  return {
    name: `${name} ${index}`,
    image: `https://nft-toolkit-collections.s3.eu-west-2.amazonaws.com/${key}`,
    attributes: attrs,
    description: "",
  };
};

interface ImgToCompileI {
  image: GeneratedImageI;
  index: number;
}

interface CompilationI {
  name: string;
  creator: string;
  layerBufs: LayerBuffersI;
  layerFreq: LayersQI;
}

export interface ReqBodyI {
  images: ImgToCompileI[];
  compInfo: CompilationI;
}

// Compiles image and uploads to S3
export const compileImageReq = async (
  imageToCompile: ImgToCompileI,
  compilationInfo: CompilationI
): Promise<TokenT> => {
  const { image, index } = imageToCompile;
  const { name, creator, layerBufs, layerFreq } = compilationInfo;
  const composites: sharp.OverlayOptions[] = [];
  const resultImage = createSharpImg(image, layerFreq, layerBufs, composites);

  const { key, filePath, uploadParams } = getUploadInfo(creator, name, index);

  await combineImages(resultImage, composites, filePath);
  uploadParams.Body = fs.readFileSync(filePath);
  await s3
    .upload(uploadParams)
    .promise()
    .then(() => fs.unlinkSync(filePath));

  return createTokenMetadata(name, index, key, image.attributes);
};

// Compiles image and uploads to S3 in background
export const compileImageNoReq = (
  imageToCompile: ImgToCompileI,
  compilationInfo: CompilationI
): TokenT => {
  const { image, index } = imageToCompile;
  const { name, creator, layerBufs, layerFreq } = compilationInfo;
  const composites: sharp.OverlayOptions[] = [];
  const resultImage = createSharpImg(image, layerFreq, layerBufs, composites);

  const { key, filePath, uploadParams } = getUploadInfo(creator, name, index);

  combineImages(resultImage, composites, filePath).then(() => {
    uploadParams.Body = fs.readFileSync(filePath);
    s3.upload(uploadParams)
      .promise()
      .then(() => fs.unlinkSync(filePath));
  });

  return createTokenMetadata(name, index, key, image.attributes);
};

export const imageToMetadata = (
  imageToCompile: ImgToCompileI,
  compilationInfo: CompilationI
): TokenT => {
  const { image, index } = imageToCompile;
  const { name, creator } = compilationInfo;

  const { key } = getUploadInfo(creator, name, index);

  return createTokenMetadata(name, index, key, image.attributes);
};
