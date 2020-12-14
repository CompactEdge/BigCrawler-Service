import React, { useState } from 'react';

// reactstrap components
import { Card, CardHeader, CardTitle, Tooltip } from 'reactstrap';

const HeadlineCard = props => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const toggle = () => {
    setTooltipOpen(!tooltipOpen);
  };
  return (
    <Card id={props.id} className="headline-card">
      <CardHeader style={{ textAlign: 'center' }}>
        <CardTitle tag="h4">{props.value}</CardTitle>
        <p className="card-category">{props.title}</p>
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
