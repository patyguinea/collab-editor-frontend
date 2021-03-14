import { Typography, makeStyles, InputAdornment, IconButton } from '@material-ui/core';
import React, { useCallback, useEffect, useState } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import api from '../../shared/api';
import Conversation from './Conversation';
import subscribeToTimer from '../../shared/socket';
import ConversationsHeader from './ConversationsHeader';
import ConversationIcons from './ConversationIcons';
import NameSelector from './NameSelector';
import Editor from '../Editor/Editor';

const useStyles = makeStyles(() => ({
  card: {
    margin: '1rem',
  },
  favorites: {
    textAlign: 'right',
    marginRight: '1rem',
  },
  author: {
    margin: '2rem 1rem',
    padding: '1rem 0',
    textAlign: 'right',
  },
  noFavorites: {
    textAlign: 'center',
    margin: '2rem',
  },
  newConversation: {
    margin: '1rem',
  },
}));

export default function Conversations() {
  const [isLoading, toggleLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [starredConvos, updateStarredConvos] = useState({});
  const [editorText, setEditorText] = useState('');
  const [name, setName] = useState('');
  const [viewFavorites, toggleViewFavorites] = useState(false);
  const classes = useStyles();

  const getConversations = useCallback(() => {
    return api('ces', 'conversations', 'GET').then(response => {
      setConversations(response.conversations);
      if (isLoading) {
        toggleLoading(false);
      }
    });
  }, [isLoading]);

  useEffect(() => {
    subscribeToTimer(err => {
      getConversations();
    });
  }, [getConversations]);

  const handleNameChange = newName => {
    setName(newName);
  };

  const handleStarClick = id => {
    updateStarredConvos(prevState => {
      if (prevState[id]) {
        const { [id]: omit, ...rest } = prevState;
        return rest;
      }
      return {
        ...prevState,
        [id]: id,
      };
    });
  };

  const handleViewFavorites = () => {
    toggleViewFavorites(!viewFavorites);
  };

  const handleDelete = id => {
    api('ces', 'conversations', 'DELETE', { id });
  };

  const handleEditorTextChange = e => {
    setEditorText(e.target.value);
  };

  const addNewConversation = () => {
    api('ces', 'conversations', 'POST', {
      text: editorText,
      author: name,
    }).then(result => {
      setEditorText('');
    });
  };

  const handleClickAddConversation = () => {
    addNewConversation();
  };

  const handleOnKeyUp = e => {
    if (e.code !== 'Enter') return;
    addNewConversation();
  };

  const conversationsViewList = viewFavorites ? conversations.filter(convo => starredConvos[convo.id]) : conversations;
  return name ? (
    <div>
      <ConversationsHeader viewFavorites={viewFavorites} handleViewFavorites={handleViewFavorites} />
      {!!conversationsViewList.length &&
        conversationsViewList.map(({ id, text, author }) => (
          <Card key={id} className={classes.card} variant="outlined">
            <CardContent>
              <ConversationIcons
                id={id}
                starredConvos={starredConvos}
                handleDelete={handleDelete}
                handleStarClick={handleStarClick}
              />
              <Conversation id={id} text={text} author={author} currentAuthor={name} />
            </CardContent>
          </Card>
        ))}
      {!isLoading && !conversationsViewList.length && (
        <Card className={classes.card} variant="outlined">
          <CardContent>
            <Typography className={classes.noFavorites} variant="h5">
              {viewFavorites ? 'No favorites selected, yet.' : 'No conversations'}
            </Typography>
          </CardContent>
        </Card>
      )}
      <div className={classes.newConversation}>
        <Editor
          placeholder="Type here to add a conversation..."
          value={editorText}
          onChange={handleEditorTextChange}
          label=""
          width="100%"
          autoFocus={false}
          onKeyUp={handleOnKeyUp}
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="submit new conversation" onClick={handleClickAddConversation}>
                <ArrowForwardIosIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </div>
      <Typography className={classes.author}>Current Author: {name}</Typography>
    </div>
  ) : (
    <NameSelector handleNameChange={handleNameChange} />
  );
}
