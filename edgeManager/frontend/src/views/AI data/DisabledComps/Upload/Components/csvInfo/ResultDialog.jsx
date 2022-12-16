import { LinearProgress } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";
import oc from "open-color";
import React from "react";
import styled from "styled-components";

const Wrap = styled.div`
    display: flex;
    flex-flow: row;
    align-items: center;
    & > * {
        display: inline-flex;
        margin: 0;
    }
`;

const ProgressWrap = styled.div`
    display: flex;
    flex-flow: row;
    align-items: center;
`;

const ResultValue = styled.div`
    max-width: 700px;
`;

const ResultHead = styled.h5`
    white-space: nowrap;
`;

const UploadedRow = styled.div`
    display: flex;
    align-items: center;
    margin-left: 0.3rem;
    color: ${oc.gray[8]};
`;
const SmallText = styled.p`
    margin-left: 0.3rem;
    color: ${oc.gray[8]};
    margin-bottom: 0;
`;

export default function ResultDialog({ data, check, responseFiles, socketThroughputed, responseValidation }) {
    return (
        <div>
            <Wrap>
                <ResultHead>중복 체크 :</ResultHead>
                {responseValidation["rv_check"] !== undefined ? (
                    <div>{check ? <Check style={{ color: green[500] }} /> : <Close color="secondary" />}</div>
                ) : null}
            </Wrap>
            <ProgressWrap>
                <ResultHead>파일 업로드: </ResultHead>
                <div
                    style={{
                        marginLeft: "0.5rem",
                        color: oc.teal[8],
                    }}
                >
                    {responseFiles["rf_progress"]}%
                </div>
            </ProgressWrap>

            {
                <LinearProgress
                    variant="determinate"
                    value={responseFiles["rf_progress"]}
                    style={{ marginBottom: "1rem" }}
                />
            }
            <Wrap>
                <ResultHead>데이터 업로드: </ResultHead>
                <UploadedRow>
                    {(socketThroughputed["throughputed_count"] || 0).toLocaleString("ko-KR")}
                    <SmallText>row</SmallText>
                </UploadedRow>
            </Wrap>
            <Wrap>
                <ResultHead>메타정보 : </ResultHead>

                {data !== undefined && data !== null ? (
                    <>
                        {Object.values(data.meta).map((value, index) => {
                            if (value !== 0) {
                                return (
                                    <UploadedRow key={index}>
                                        {Object.keys(data.meta)[index]}({value})
                                    </UploadedRow>
                                );
                            }
                        })}
                    </>
                ) : null}
            </Wrap>
            <Wrap>
                <ResultHead>데이터베이스 : </ResultHead>
                {data !== undefined && data !== null ? (
                    <UploadedRow>{Object.keys(data.time_series)}</UploadedRow>
                ) : (
                    <></>
                )}
            </Wrap>
            {/* <Wrap>
                <ResultHead>데이터 : </ResultHead>
                {data !== undefined ? data. <UploadedRow></UploadedRow> : null}
            </Wrap> */}
        </div>
    );
}
