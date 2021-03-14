import React from 'react';
import { makeStyles, IconButton, Tooltip } from '@material-ui/core';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  icons: {
    float: 'right',
  },
}));

const getIcons = props => [
  {
    title: 'Delete',
    icon: <DeleteIcon />,
    onClick: props.handleDelete,
  },
  {
    title: 'Add to Favorites',
    icon: props.starredConvos[props.id] ? <StarIcon /> : <StarOutlineIcon />,
    onClick: props.handleStarClick,
  },
];

export default function ConversationIcons(props) {
  const classes = useStyles();
  return (
    <div className={classes.icons}>
      {getIcons(props).map(({ title, icon, onClick }) => (
        <Tooltip key={title} title={title}>
          <IconButton aria-label={title.toLowerCase()} onClick={() => onClick(props.id)}>
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </div>
  );
}
