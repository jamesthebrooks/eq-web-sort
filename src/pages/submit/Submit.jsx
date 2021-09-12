import React, { useEffect } from "react";
// import globalState from "../../globalState/globalState";
import setGlobalState from "../../globalState/setGlobalState";
import { view } from "@risingstack/react-easy-state";
import styled from "styled-components";
import ReactHtmlParser from "react-html-parser";
import decodeHTML from "../../utilities/decodeHTML";
import SubmitButton from "./SubmitButton";
import getGlobalState from "../../globalState/getGlobalState";
import calculatePostsortResults from "./calculatePostsortResults";
import SubmitFallback from "./SubmitFallback";
import { v4 as uuid } from "uuid";

const SubmitPage = () => {
  useEffect(() => {
    setGlobalState("currentPage", "submit");
  }, []);

  // language options
  const langObj = getGlobalState("langObj");
  const transferTextAbove = decodeHTML(langObj.transferTextAbove);
  const transferTextBelow = decodeHTML(langObj.transferTextBelow);

  // config options
  const configObj = getGlobalState("configObj");
  const headerBarColor = configObj.headerBarColor;

  // global state
  const displaySubmitFallback = getGlobalState("displaySubmitFallback");

  // format results for transmisson
  let transmissionResults = {};
  let results = getGlobalState("results");
  let resultsPostsort = getGlobalState("resultsPostsort");
  let resultsSurvey = getGlobalState("resultsSurvey");

  // finish setup and format results object
  transmissionResults["projectName"] = configObj.studyTitle;
  transmissionResults["partId"] = getGlobalState("partId");
  transmissionResults["randomId"] = uuid().substring(0, 12);
  transmissionResults["dateTime"] = results.dateTime;
  transmissionResults["timeLanding"] = results.timeOnlandingPage;
  transmissionResults["timePresort"] = results.timeOnpresortPage;
  transmissionResults["timeSort"] = results.timeOnsortPage;
  if (configObj.showPostsort === true) {
    transmissionResults["timePostsort"] = results.timeOnpostsortPage;
  }
  if (configObj.showSurvey === true) {
    transmissionResults["timeSurvey"] = results.timeOnsurveyPage;
  }

  let numPos = results.npos;
  if (isNaN(numPos)) {
    numPos = 0;
  }
  let numNeu = results.nneu;
  if (isNaN(numNeu)) {
    numNeu = 0;
  }
  let numNeg = results.nneg;
  if (isNaN(numNeg)) {
    numNeg = 0;
  }

  transmissionResults["npos"] = numPos;
  transmissionResults["nneu"] = numNeu;
  transmissionResults["nneg"] = numNeg;

  // if project included POSTSORT, read in complete sorted results
  if (configObj.showPostsort) {
    const newPostsortObject = calculatePostsortResults(
      resultsPostsort,
      configObj
    );
    const keys = Object.keys(newPostsortObject);
    for (let i = 0; i < keys.length; i++) {
      transmissionResults[keys[i]] = newPostsortObject[keys[i]];
    }
  }

  // if project included SURVEY, read in results
  if (configObj.showSurvey) {
    const keys2 = Object.keys(resultsSurvey);
    for (let ii = 0; ii < keys2.length; ii++) {
      transmissionResults[keys2[ii]] = resultsSurvey[keys2[ii]];
    }
  }
  transmissionResults["sort"] = results.sort;

  return (
    <React.Fragment>
      <SortTitleBar background={headerBarColor}>
        {langObj.transferHead}
      </SortTitleBar>
      <ContainerDiv>
        <ContentDiv>{ReactHtmlParser(transferTextAbove)}</ContentDiv>
        <SubmitButton results={transmissionResults} />

        {displaySubmitFallback ? (
          <SubmitFallback results={transmissionResults} />
        ) : (
          <ContentDiv>{ReactHtmlParser(transferTextBelow)}</ContentDiv>
        )}
      </ContainerDiv>
      {/* <h1>test</h1> */}
    </React.Fragment>
  );
};

export default view(SubmitPage);

const SortTitleBar = styled.div`
  width: calc(100vw-4px);
  padding-left: 1.5vw;
  padding-right: 1.5vw;
  padding-top: 5px;
  min-height: 50px;
  background-color: ${(props) => props.background};
  display: flex;
  justify-content: center;
  align-content: center;
  color: white;
  font-weight: bold;
  font-size: 28px;
`;

const ContainerDiv = styled.div`
  display: flex;
  min-height: 800px;
  width: calc(100vw-4px);
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.2em;
  width: 85vw;
  font-size: 1.35em;
  padding: 25px;
  align-self: center;
`;
