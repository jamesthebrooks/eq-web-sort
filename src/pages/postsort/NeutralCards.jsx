import React, { Component } from "react";
import styled from "styled-components";
import { view } from "@risingstack/react-easy-state";
// import getPostSortCardStyleHigh from './getPostSortCardStyleHigh';

/* eslint react/prop-types: 0 */

// const styles = {
//   container: {
//     width: '80%',
//     border: `2px solid black`,
//     marginTop: 50,
//     marginLeft: '10%',
//     borderRadius: `3px`,
//   },
//   cardAndTextHolder: {
//     display: `flex`,
//     alignContent: `center`,
//     background: `#7e7e7e`,
//   },
//   textHolder: {
//     marginTop: 5,
//     flexGrow: 5,
//   },
//   cardTag: {
//     width: `100%`,
//     background: `darkgray`,
//     color: `black`,
//     textAlign: `center`,
//   },
// };

// LowCards example ===> {high: ["column4"], middle: ["column0"], low: ["columnN4"]}

class NeutralCards extends Component {
  // on blur, get text and add comment to card object
  onBlur = (event, columnStatements, columnDisplay, itemId) => {
    const cards = columnStatements.vCols[columnDisplay];
    const targetCard = event.target.id;
    const userEnteredText = event.target.value;

    const identifier = `${columnDisplay}_Card${itemId + 1}`;

    // pull in state object for comments
    const statementCommentsObj =
      JSON.parse(localStorage.getItem("statementCommentsObj")) || {};

    // to update just the card that changed
    cards.map((el) => {
      if (el.id === targetCard) {
        const comment3 = userEnteredText;
        // remove new line and commas to make csv export easier
        const comment2 = comment3.replace(/\n/g, " ");
        const comment = comment2.replace(/,/g, " ");
        // assign to main data object for confirmation / debugging
        el.comment = comment;
        // assign to comments object
        statementCommentsObj[identifier] = `${el.id}>>>${comment}`;
      }
      return el;
    });

    localStorage.setItem(
      "statementCommentsObj",
      JSON.stringify(statementCommentsObj)
    );

    localStorage.setItem("columnStatements", JSON.stringify(columnStatements));
  }; // end onBlur

  render() {
    const {
      height,
      width,
      cardFontSize,
      columnDisplay,
      neutralObj,
      neutralCards,
      columnStatements,
    } = this.props;
    const { neutralText, placeholder } = neutralObj;

    return neutralCards.map((item, index) => (
      <Container key={item.statement}>
        <CardTag>{neutralText}</CardTag>
        <CardAndTextHolder>
          <Card cardFontSize={cardFontSize} width={width} height={height}>
            {item.statement}
          </Card>
          <TagContainerDiv>
            <CommentArea
              data-gramm_editor="false"
              id={item.id}
              height={height}
              className="commentTextArea"
              placeholder={placeholder}
              defaultValue={item.comment}
              onBlur={(e) => {
                this.onBlur(e, columnStatements, columnDisplay, index);
              }}
            />
          </TagContainerDiv>
        </CardAndTextHolder>
      </Container>
    ));
  }
}

export default view(NeutralCards);

const Container = styled.div`
  width: 90vw;
  max-width: 900px;
  margin-top: 50px;
  border-radius: 3px;
`;

const CardTag = styled.div`
  width: 100%;
  background: lightgray;
  color: black;
  text-align: center;
`;

const CardAndTextHolder = styled.div`
  display: flex;
  align-content: center;
  background: #7e7e7e;
  width: 90vw;
  max-width: 900px;
`;

const CommentArea = styled.textarea`
  padding: 10px;
  background-color: whitesmoke;
  height: ${(props) => `${props.height}px;`};
  width: calc(100% - 6px);
`;

const TagContainerDiv = styled.div`
  padding-top: 3px;
  width: 100%;
`;

const Card = styled.div`
  user-select: "none";
  padding: 0 2px 0 2px;
  margin: 5px 5px 5px 5px;
  line-height: 1em;
  height: ${(props) => `${props.height}px;`};
  max-width: ${(props) => `${props.width}px;`};
  border-radius: 5px;
  font-size: ${(props) => props.cardFontSize};
  display: flex;
  align-items: center;
  border: 2px solid black;
  background-color: #f6f6f6;
  text-align: center;
`;
