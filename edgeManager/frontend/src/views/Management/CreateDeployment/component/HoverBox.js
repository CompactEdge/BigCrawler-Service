import MDBox from 'components/MDBox';
import React from 'react';
import { grey } from '@mui/material/colors';

function HoverBox({
  type,
  provided,
  item,
  index,
  snapshot,
  mainColor,
  hoverColor,
  width,
}) {
  const [isHovering, setIsHovering] = React.useState();
  const keyColor = grey[500];
  snapshot.isHover = isHovering

  function ContentBoxStyle({ cKey, cVal }) {
    return (
      <MDBox
        display="flex"
        mr={1}
      >
        <MDBox
          mr={0.5}
          mt={0.5}
          fontSize="12px"
          fontWeight="500"
          style={{
            color: keyColor,
          }}
        >
          {cKey}
        </MDBox>
        <MDBox
          fontSize="14px"
          fontWeight="500"
          textTransform="capitalize"
          style={{
            color: mainColor,
          }}
        >
          {cVal || "no data"}
          {cKey !== "age" && ","}
        </MDBox>
      </MDBox>
    );
  };

  const getContent = (item) => {
    if (type === "image") {
      return (
        <MDBox
          fontSize="14px"
          fontWeight="500"
          textTransform="capitalize"
          style={{
            color: mainColor,
          }}
        >
          {item.content}
        </MDBox>
      );
    } else if (type === "deployment") {
      return (
        <MDBox display="flex">
          <ContentBoxStyle cKey="name" cVal={item.name} />
          <ContentBoxStyle cKey="ready_replicas" cVal={item.ready_replicas} />
          <ContentBoxStyle cKey="replicas" cVal={item.replicas} />
          <ContentBoxStyle cKey="age" cVal={item.age} />
        </MDBox>
      );
    }
  };

  return (
    <MDBox
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      key={type === "deployment" ? `${item.name}-${index}` : `${item.id}-${index}`}
      width={width}
      style={{
        borderRadius: 5,
        padding: 16,
        margin: "0 0 8px 0",
        border: "1px solid",
        borderColor: mainColor,
        backgroundColor: snapshot.isDragging || snapshot.isHover ? hoverColor : "#fff",
        ...provided.draggableProps.style
      }}
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      {getContent(item)}
    </MDBox>
  );
}

export default HoverBox;