import Edit from '@mui/icons-material/Edit';
import { Divider, IconButton } from '@mui/material';
import FileCopyOutlined from '@mui/icons-material/FileCopyOutlined';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import YouTube from 'react-youtube';
import SentenceParsePane from './SentenceParsePane';
import SetMarksForm from './SetMarksForm';
import { SentenceParseListPageContext } from '../services/sentenceParseListPage';
import { css } from '@emotion/css';
import { YoutubeEmbeded } from '@chihatw/lang-gym-h.ui.youtube-embeded';

const SentenceParseList = () => {
  const history = useHistory();
  const { sentenceParseNews, article, sentences, onCopy } = useContext(
    SentenceParseListPageContext
  );
  return (
    <div>
      <div style={{ padding: '16px 0 24px', width: '50vw' }}>
        {!!article!.embedID && (
          <YoutubeEmbeded
            embedId={article!.embedID}
            offSet={400}
            transition={1000}
            isShowControls={false}
          />
        )}
      </div>
      <div
        style={{
          height: 1000,
          overflowY: 'scroll',
          border: '1px solid #ddd',
          borderRadius: 4,
        }}
      >
        {sentences.map((sentence, index) => (
          <div key={sentence.id}>
            <div
              style={{
                padding: '16px 16px 8px',
                fontSize: 12,
                color: '#555',
              }}
            >
              <div style={{ fontSize: 18, marginBottom: 8 }}>{`${
                index + 1
              } .`}</div>

              <div>{sentence.japanese}</div>
              <div style={{ color: '#aaa' }}>{sentence.original}</div>
              <div style={{ color: 'orange' }}>{sentence.chinese}</div>
              <div style={{ padding: '8px' }}>
                {!!sentenceParseNews[sentence.id] && (
                  <SentenceParsePane
                    sentenceParseNew={sentenceParseNews[sentence.id]}
                  />
                )}
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <div>
                  <IconButton
                    size='small'
                    onClick={() =>
                      history.push(`/sentence/${sentence.id}/parse`)
                    }
                  >
                    <Edit />
                  </IconButton>
                </div>
                <div style={{ width: 8 }} />
                <div>
                  <IconButton size='small' onClick={() => onCopy(index)}>
                    <FileCopyOutlined />
                  </IconButton>
                </div>
              </div>
            </div>

            {!!sentences[index + 1] ? (
              <Divider />
            ) : (
              <div style={{ height: 400 }} />
            )}
          </div>
        ))}
        <div></div>
      </div>
      <div style={{ height: 24 }} />
      <SetMarksForm />
    </div>
  );
};

export default SentenceParseList;
