import React from 'react';
import StepContents from './StepContents';

function Step1({ data, stepIndex }) {
  const [stepData, setStepData] = React.useState(data[0].content);

  React.useEffect(()=>{
    setStepData(data[stepIndex].content)
  },[stepIndex])
  
  // const [stepData, setStepData] = React.useState(
  //   [
  //     {
  //       title: "1. 노드 확인",
  //       content:
  //       {
  //         ip: "none",
  //         username: "none",
  //         password: "none",
  //         port: "none"
  //       },
  //     },
  //     {
  //       title: "2. 디렉토리 생성",
  //       content:
  //       {
  //         dirname: "none",
  //         path: "none"
  //       }
  //     }
  //   ]
  // );

  React.useState(() => {
    console.log("data: ", data);
  }, [data]);

  return (
    <>
      {/* <StepContents title={"1. 노드 확인"} contentData={contentData} setContentData={setContentData} /> */}
      {stepData && stepData.map((data, idx) => {
        return (
          <div key={`${data.title}_${idx}`}>
            <StepContents title={data.title} stepContentData={data.content} stepIndex={stepIndex}/>
          </div>
        )
      })}
    </>
  );
}

export default Step1;