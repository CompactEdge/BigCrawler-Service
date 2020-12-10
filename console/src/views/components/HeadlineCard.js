import React, { useState } from 'react';

// reactstrap components
import { Card, CardHeader, CardTitle, Tooltip } from 'reactstrap';

const style = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  margin: '0 -15px',
  borderTop: '1px solid rgba(255,165,0,0.4)',
  padding: '0 10px',
};

const HeadlineCard = props => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => {
    setTooltipOpen(!tooltipOpen);
  };
  return (
    <Card id={props.id}>
      <CardHeader style={{ textAlign: 'center' }}>
        <CardTitle tag="h4">{props.value}</CardTitle>
        <p className="card-category" style={style}>
          {props.title}
        </p>
      </CardHeader>
      <Tooltip
        placement="bottom"
        isOpen={tooltipOpen}
        target={props.id}
        toggle={toggle}>
        {props.tooltip}
      </Tooltip>
    </Card>
  );
};

export default HeadlineCard;
