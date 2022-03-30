import React from 'react';
import BranchPane from './BranchPane';
import CommentPane from './CommentPane';

const SentenceBody: React.FC<{
  color: string;
  joshiLabels: string[];
  isTaigendome: boolean;
  hasTopicBranch: boolean;
  commentUnitIds: string[];
  topicBranchUnitId: string;
  hasMultipleComments: boolean;
}> = ({
  color,
  joshiLabels,
  isTaigendome,
  hasTopicBranch,
  commentUnitIds,
  topicBranchUnitId,
  hasMultipleComments,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        columnGap: 8,
        gridAutoFlow: 'column',
        gridTemplateColumns: 'auto 1fr',
      }}
    >
      {hasTopicBranch && (
        <BranchPane
          unitId={topicBranchUnitId}
          joshiLabels={joshiLabels}
          isCommentMeishi={false}
          topicBorderColor={color}
        />
      )}

      {!!commentUnitIds.length && (
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <div>
            <CommentsBorder color={color} isTaigendome={isTaigendome}>
              <div style={{ display: 'grid', rowGap: 4 }}>
                {commentUnitIds.map((unitId) => (
                  <CommentPane
                    key={unitId}
                    unitId={unitId}
                    hasMultipleComments={hasMultipleComments}
                  />
                ))}
              </div>
            </CommentsBorder>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentenceBody;

const CommentsBorder: React.FC<{
  color: string;
  isTaigendome: boolean;
}> = ({ children, isTaigendome, color }) => {
  if (!isTaigendome) {
    return (
      <div
        style={{
          border: `2px solid ${color}`,
          padding: 4,
          borderRadius: 8,
        }}
      >
        {children}
      </div>
    );
  } else {
    return <div>{children}</div>;
  }
};
