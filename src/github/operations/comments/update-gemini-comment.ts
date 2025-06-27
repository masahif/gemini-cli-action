import { Octokit } from "@octokit/rest";

export type UpdateCommentParams = {
  owner: string;
  repo: string;
  commentId: number;
  body: string;
  isPullRequestReviewComment: boolean;
};

export type UpdateCommentResult = {
  id: number;
  html_url: string;
  updated_at: string;
};

/**
 * Updates a Claude comment on GitHub (either an issue/PR comment or a PR review comment)
 *
 * @param octokit - Authenticated Octokit instance
 * @param params - Parameters for updating the comment
 * @returns The updated comment details
 * @throws Error if the update fails
 */
export async function updateGeminiComment(
  octokit: Octokit,
  params: UpdateCommentParams,
) {
  const { owner, repo, commentId, body, isPullRequestReviewComment } = params;

  try {
    if (isPullRequestReviewComment) {
      const { data } = await octokit.pulls.updateReviewComment({
        owner,
        repo,
        comment_id: commentId,
        body,
      });
      return data;
    } else {
      const { data } = await octokit.issues.updateComment({
        owner,
        repo,
        comment_id: commentId,
        body,
      });
      return data;
    }
  } catch (error) {
    console.error(
      `Failed to update ${isPullRequestReviewComment ? "PR review" : "issue"} comment ${commentId}:`,
      error,
    );
    throw error;
  }
}
