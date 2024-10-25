import "./App.css";
import React from "react";
import Home from "./components/Home";
import Divider from '@mui/material/Divider';
import { useState, useEffect } from "react";
import { decode } from "html-entities";

function App() {
  const [start, setStart] = useState(true);
  const [allData, setData] = useState(null);
  const [questions, setquestions] = useState([]);
  const [allselected, setSelected] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [correctA, setcorrect] = useState(0);
  function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }
  useEffect(() => {
    if (
      questions.length > 0 &&
      questions.find((s) => s.selectedAnswer === "") === undefined
    ) {
      setSelected(true);
    }
  }, [questions]);

  useEffect(() => {
    console.log(allData);
    if (allData) {
      let newA = [];
      newA = allData.map((item) => {
        return {
          question: item.question,
          answers: shuffle([...item.incorrect_answers, item.correct_answer]),
          correct_answer: item.correct_answer,
          selectedAnswer: "",
        };
      });

      setquestions(newA);
    }
  }, [allData]);

  useEffect(() => {
    if (!start) {
      console.log("start:", { start });
      const fetchData = async function () {
        const res = await fetch(
          "https://opentdb.com/api.php?amount=5&encode=url3986"
        );
        const data = await res.json();

        setData(data.results);
      };

      // call the function
      fetchData();
    }
  }, [start]);

  function handleStart() {
    setStart(false);
  }

  function selected(item, a) {
    let newA = [];
    questions.map((olditem) => {
      if (olditem === item) {
        newA = [...newA, { ...item, selectedAnswer: a }];
      } else {
        newA = [...newA, olditem];
      }
    });
    setquestions(newA);
  }

  function handleSubmit() {
    setSubmitted(true);
    let number_of_correct = 0;
    questions.map((item) => {
      if (item.correct_answer === item.selectedAnswer) {
        number_of_correct += 1;
      }
    });
    setcorrect(number_of_correct);
  }

  function Handlestyles(item, a) {
    if (item.selectedAnswer === a && submitted === false) {
      return { backgroundColor: "#D6DBF5" };
    } else if (submitted) {
      if (item.correct_answer === a) {
        return { backgroundColor: "#94D7A2" };
      } else if (item.selectedAnswer === a) {
        return { backgroundColor: "#F8BCBC" };
      }
    }
  }

  return (
    <div className="App">
      {start && (
        <div>
          <Home />
          <button id="start" onClick={handleStart}>
            Start quiz
          </button>
        </div>
      )}

      {questions &&
        questions.map((item) => {
          let answers = item.answers.map((a) => {
            return (
              <button
                onClick={() => {
                  selected(item, a);
                }}
                style={Handlestyles(item, a)}
                disabled={submitted}
              >
                {decode(decodeURIComponent(a))}
              </button>
            );
          });

          return (
            <div className="question">
              <h1>{decode(decodeURIComponent(item.question))}</h1>
              <div className="answers">{answers}</div>
              <Divider orientation="horizontal" flexItem />
            </div>
          );
        })}
      {allselected && !submitted && (
        <button
          className="q-buttons"
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </button>
      )}
      {submitted && !start && (
        <div className="game_ended">
          <p>Number of Correct Answers:{correctA}</p>
          <button
            className="q-buttons"
            onClick={() => {
              setStart(true);
              setData(null);
              setquestions([]);
              setSubmitted(false);
              setSelected(false);
            }}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
