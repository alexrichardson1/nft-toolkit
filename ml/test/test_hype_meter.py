"""
Test API - tests flask functionality
"""
import sys
from unittest.mock import MagicMock, patch
import unittest

sys.path.insert(1, './api')
from hype_meter import HypeMeter  # noqa # pylint:disable=import-error, wrong-import-position


@patch("os.getenv", return_value="foo")
class TestHypeMeter(unittest.TestCase):
    """
    Test Class for Hype Meter
    """

    def setUp(self):
        """
        Set up function to create hypemeters
        """
        self.mock_hype_meter1 = HypeMeter("cyberPunks", None, None)
        self.mock_hype_meter2 = HypeMeter("cyberPunks", "reddit", None)
        self.mock_hype_meter3 = HypeMeter("cyberPunks", None, "twitter")
        self.mock_hype_meter4 = HypeMeter("cyberPunks", "reddit", "twitter")

    def test_get_num_of_twitter_followers_user1(self, mock_get_env):
        """
        Returns 0 if no Twitter handle
        """
        assert self.mock_hype_meter1.get_num_of_twitter_followers() == 0
        assert not mock_get_env.called

    def test_get_num_of_twitter_followers_user3(self, mock_get_env):
        """
        Successfully returns correct number from API
        """
        with patch('hype_meter.requests.request') as mocked_request:
            mocked_request.return_value.text = '{"followers_count":10}'
            mocked_request.return_value.status_code = 200
            assert self.mock_hype_meter3.get_num_of_twitter_followers() == 10
            assert mock_get_env.called

    def test_get_num_of_twitter_followers_user4_failed_request(self, mock_get_env):
        """
        Returns 0 if API call fails
        """
        with patch('hype_meter.requests.request') as mocked_request:
            mocked_request.return_value.status_code = 404
            assert self.mock_hype_meter4.get_num_of_twitter_followers() == 0
            assert mock_get_env.called

    def test_get_num_of_twitter_followers_user4_followers_count_not_in_response(self, mock_get_env):
        """
        Returns 0 if API response does not contain followers_count
        """
        with patch('hype_meter.requests.request') as mocked_request:
            mocked_request.return_value.text = '{"foo":10}'
            mocked_request.return_value.status_code = 200
            assert self.mock_hype_meter4.get_num_of_twitter_followers() == 0
            assert mock_get_env.called

    def test_get_subreddits_with_handle_user1(self, mock_get_env):
        """
        Returns 0 if no Twitter handle
        """
        assert self.mock_hype_meter1.get_subreddits_with_handle() == []
        assert not mock_get_env.called

    def test_get_subreddits_with_handle_user2(self, mock_get_env):
        """
        Successfully returns correct list from API
        """
        with patch('hype_meter.requests.post') as mocked_post:
            mocked_post.return_value.status_code = 200
            mocked_post.return_value.text = '{"subreddits":["Obj1", "Obj2"]}'

            subreddits = self.mock_hype_meter2.get_subreddits_with_handle()
            assert len(subreddits) == 2
            assert subreddits[0] == 'Obj1'
            assert subreddits[1] == 'Obj2'
            assert mock_get_env.called

    def test_get_subreddits_with_handle_failed_request(self, mock_get_env):
        """
        Returns [] if API call fails
        """
        with patch('hype_meter.requests.post') as mocked_post:
            mocked_post.return_value.status_code = 404
            assert len(self.mock_hype_meter4.get_subreddits_with_handle()) == 0
            assert mock_get_env.called

    def test_get_subreddits_with_handle_user4_subreddits_not_in_response(self, mock_get_env):
        """
        Returns 0 if API response does not contain subreddits
        """
        with patch('hype_meter.requests.post') as mocked_post:
            mocked_post.return_value.text = '{"foo":10}'
            mocked_post.return_value.status_code = 200
            assert self.mock_hype_meter4.get_subreddits_with_handle() == []
            assert mock_get_env.called

    def test_get_num_of_reddit_members_user1(self, mock_get_env):
        """
        Get number of reddit members without handle
        """
        assert self.mock_hype_meter1.get_num_of_reddit_members() == 0
        assert not mock_get_env.called

    def test_get_num_of_reddit_members_user2(self, mock_get_env):
        """
        Get number of reddit members with a successful call to the API
        """
        with patch('hype_meter.requests.post') as mocked_post:
            mocked_post.return_value.status_code = 200
            mocked_post.return_value.text = \
                '{"subreddits":[{"subscriber_count":10}, {"subscriber_count":20}]}'
            assert self.mock_hype_meter2.get_num_of_reddit_members() == 10
            assert mock_get_env.called

    def test_get_num_of_reddit_members_user2_failed(self, mock_get_env):
        """
        Get number of reddit members with a successful call to the API
        """
        with patch('hype_meter.requests.post') as mocked_post:
            mocked_post.return_value.status_code = 200
            mocked_post.return_value.text = '{"subreddits":[{"foo":10}, {"subscriber_count":20}]}'
            assert self.mock_hype_meter2.get_num_of_reddit_members() == 0
            assert mock_get_env.called
            assert mocked_post.call_count == 2

    def test_get_score_from_reddit_user1(self, mock_get_env):
        """
        Returns 0 if no reddit handle
        """
        assert self.mock_hype_meter1.get_score_from_reddit() == 0
        assert not mock_get_env.called

    def test_get_score_from_reddit_user2(self, mock_get_env):
        """
        Get number of reddit members with a successful call to the API
        """
        with patch('hype_meter.requests.post') as mocked_post:
            mocked_post.return_value.status_code = 200
            mocked_post.return_value.text = '{"subreddits":' + \
                '[{"subscriber_count":10, "active_user_count":5},' + \
                ' {"subscriber_count":23, "active_user_count":2}]}'
            assert self.mock_hype_meter2.get_score_from_reddit() == 40
            assert mock_get_env.called
            assert mocked_post.call_count == 2

    def test_get_score_from_reddit_user2_without_sub_count(self, mock_get_env):
        """
        Get number of reddit members with a successful call to the API
        """
        with patch('hype_meter.requests.post') as mocked_post:
            mocked_post.return_value.status_code = 200
            mocked_post.return_value.text = '{"subreddits":' + \
                '[{"active_user_count":5},' + \
                ' {"active_user_count":2}]}'
            assert self.mock_hype_meter2.get_score_from_reddit() == 7
            assert mock_get_env.called
            assert mocked_post.call_count == 2

    def test_get_score_from_reddit_user2_without_active_members(self, mock_get_env):
        """
        Get number of reddit members with a successful call to the API
        """
        with patch('hype_meter.requests.post') as mocked_post:
            mocked_post.return_value.status_code = 200
            mocked_post.return_value.text = '{"subreddits":' + \
                '[{"subscriber_count":15},' + \
                ' {"subscriber_count":23}]}'
            assert self.mock_hype_meter2.get_score_from_reddit() == 38
            assert mock_get_env.called
            assert mocked_post.call_count == 2

    def test_get_score_from_reddit_user2_mixed_missing_numbers(self, mock_get_env):
        """
        Get number of reddit members with a successful call to the API
        """
        with patch('hype_meter.requests.post') as mocked_post:
            mocked_post.return_value.status_code = 200
            mocked_post.return_value.text = '{"subreddits":' + \
                '[{"active_user_count":15},' + \
                ' {"subscriber_count":23}]}'
            assert self.mock_hype_meter2.get_score_from_reddit() == 38
            assert mock_get_env.called
            assert mocked_post.call_count == 2

    # pylint:disable=unused-argument
    def test_get_overall_score_using_handles(self, mock_get_env):
        """
        Get overall score using the handles
        """
        self.mock_hype_meter4.get_score_from_reddit = MagicMock(
            return_value=10)
        self.mock_hype_meter4.get_score_from_twitter = MagicMock(
            return_value=10)
        assert self.mock_hype_meter4.get_overall_score_using_handles() == 20

    # pylint:disable=unused-argument
    def test_get_hype_using_handles(self, mock_get_env):
        """
        Get overall score using the handles
        """
        self.mock_hype_meter4.get_overall_score_using_handles = MagicMock(
            return_value=45)
        similar_collections = [
            {'name': 'foo', 'reddit_score': 12, 'twitter_score': 47}]

        assert self.mock_hype_meter4.get_hype(
            similar_collections) == (45 / (12 + 47))

    # pylint:disable=unused-argument
    def test_get_hype_using_handles_very_hyped(self, mock_get_env):
        """
        Get overall score using the handles
        """
        self.mock_hype_meter4.get_overall_score_using_handles = MagicMock(
            return_value=12235)
        similar_collections = [
            {'name': 'foo', 'reddit_score': 12, 'twitter_score': 47}]

        assert self.mock_hype_meter4.get_hype(similar_collections) == 1

    # pylint:disable=unused-argument
    def test_get_hype_using_handles_badly_hyped_similar_collections(self, mock_get_env):
        """
        Get overall score using the handles for a collection with similar collections with bad hype
        """
        self.mock_hype_meter4.get_overall_score_using_handles = MagicMock(
            return_value=10)
        similar_collections = [
            {'name': 'foo', 'reddit_score': 0, 'twitter_score': 0}]

        assert self.mock_hype_meter4.get_hype(similar_collections) == 1

    # pylint:disable=unused-argument
    def test_get_hype_badly_hyped_similar_collections_and_bad_hype(self, mock_get_env):
        """
        Get overall score using the handles for a collection with a bad hype
            and bad hype on similar collections
        """
        self.mock_hype_meter4.get_overall_score_using_handles = MagicMock(
            return_value=0)
        similar_collections = [
            {'name': 'foo', 'reddit_score': 0, 'twitter_score': 0}]

        assert self.mock_hype_meter4.get_hype(similar_collections) == 0

    # pylint:disable=unused-argument
    def test_get_hype_using_handles_bad_hype(self, mock_get_env):
        """
        Get overall score using the handles for a collection with a bad hype
        """
        self.mock_hype_meter4.get_overall_score_using_handles = MagicMock(
            return_value=0)
        similar_collections = [
            {'name': 'foo', 'reddit_score': 20, 'twitter_score': 50}]

        assert self.mock_hype_meter4.get_hype(similar_collections) == 0


if __name__ == '__main__':
    unittest.main()
