import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const [can, setCan] = useState();
  const [toaster, setToaster] = useState(false);
  const notify = () => toast("Welcome to the team");

  useEffect(() => {
    const PUZZLE_HOVER_TINT = "#009900";
    var img = new Image();
    const canvas = document.querySelector("#canvas");
    const stage = canvas.getContext("2d");
    let size = 1;
    let pieces;
    let piece;
    let puzzleWidth;
    let puzzleHeight;
    let pieceWidth;
    let pieceHeight;
    let currentPiece;
    let currentDropPiece;
    let mouse;
    img.addEventListener("load", onImage, false);

    function randomImg() {
      let arrayImg = [
        "https://pixabay.com/users/mastersystem60-30356571/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=7546974",

        "https://tuk-cdn.s3.amazonaws.com/can-uploader/subway-gf1e5e2566_640.jpg",

        "https://tuk-cdn.s3.amazonaws.com/can-uploader/copper-teapots-g22c897130_640.jpg",

        "https://tuk-cdn.s3.amazonaws.com/can-uploader/horses-g393d50e19_640.jpg",

        "https://tuk-cdn.s3.amazonaws.com/can-uploader/germany-g38931446a_640.jpg",

        "https://tuk-cdn.s3.amazonaws.com/can-uploader/namib-desert-g887d8d8e5_640.jpg",
      ];

      return arrayImg[parseInt(Math.random() * 5)];
    }

    img.src = randomImg();

    function initPuzzle() {
      pieces = [];
      mouse = {
        x: 0,
        y: 0,
      };
      currentPiece = null;
      currentDropPiece = null;
      stage.drawImage(
        img,
        0,
        0,
        puzzleWidth,
        puzzleHeight,
        0,
        0,
        puzzleWidth,
        puzzleHeight
      );
      // createTitle("START");
      buildPieces();
    }

    function setCanvas() {
      canvas.width = puzzleWidth;
      canvas.height = puzzleHeight;
      canvas.style.border = "1px solid black";
    }

    function onImage() {
      pieceWidth = Math.floor(img.width / size);
      pieceHeight = Math.floor(img.height / size);
      puzzleWidth = pieceWidth * size;
      puzzleHeight = pieceHeight * size;
      setCanvas();
      initPuzzle();
    }

    // function createTitle(msg) {
    //   stage.fillStyle = "rgb(21 128 61)";
    //   stage.globalAlpha = 0.4;
    //   stage.fillRect(100, puzzleHeight - 40, puzzleWidth - 200, 40);
    //   stage.fillStyle = "#FFFFFF";
    //   stage.globalAlpha = 1;
    //   stage.textAlign = "center";
    //   stage.textBaseline = "middle";
    //   stage.font = "20px Arial";
    //   stage.fillText(msg, puzzleWidth / 2, puzzleHeight - 20);

    // }

    function buildPieces() {
      let i;
      let piece;
      let xPos = 0;
      let yPos = 0;
      for (i = 0; i < size * size; i++) {
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        pieces.push(piece);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) {
          xPos = 0;
          yPos += pieceHeight;
        }
      }
      document.getElementById("str").onpointerdown = shufflePuzzle;
    }

    function shufflePuzzle() {
      pieces = shuffleArray(pieces);
      stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
      let xPos = 0;
      let yPos = 0;
      for (const piece of pieces) {
        piece.xPos = xPos;
        piece.yPos = yPos;
        stage.drawImage(
          img,
          piece.sx,
          piece.sy,
          pieceWidth,
          pieceHeight,
          xPos,
          yPos,
          pieceWidth,
          pieceHeight
        );
        stage.strokeRect(xPos, yPos, pieceWidth, pieceHeight);
        xPos += pieceWidth;
        if (xPos >= puzzleWidth) {
          xPos = 0;
          yPos += pieceHeight;
        }
      }
      document.onpointerdown = onPuzzleClick;
    }

    function checkPieceClicked() {
      for (const piece of pieces) {
        if (
          mouse.x < piece.xPos ||
          mouse.x > piece.xPos + pieceWidth ||
          mouse.y < piece.yPos ||
          mouse.y > piece.yPos + pieceHeight
        ) {
          //PIECE NOT HIT
        } else {
          return piece;
        }
      }
      return null;
    }

    function updatePuzzle(e) {
      currentDropPiece = null;
      if (e.layerX || e.layerX == 0) {
        mouse.x = e.layerX - canvas.offsetLeft;
        mouse.y = e.layerY - canvas.offsetTop;
      } else if (e.offsetX || e.offsetX == 0) {
        mouse.x = e.offsetX - canvas.offsetLeft;
        mouse.y = e.offsetY - canvas.offsetTop;
      }
      stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
      for (const piece of pieces) {
        if (piece == currentPiece) {
          continue;
        }
        stage.drawImage(
          img,
          piece.sx,
          piece.sy,
          pieceWidth,
          pieceHeight,
          piece.xPos,
          piece.yPos,
          pieceWidth,
          pieceHeight
        );
        stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        if (currentDropPiece == null) {
          if (
            mouse.x < piece.xPos ||
            mouse.x > piece.xPos + pieceWidth ||
            mouse.y < piece.yPos ||
            mouse.y > piece.yPos + pieceHeight
          ) {
            //NOT OVER
          } else {
            currentDropPiece = piece;
            stage.save();
            stage.globalAlpha = 0.4;
            stage.fillStyle = PUZZLE_HOVER_TINT;
            stage.fillRect(
              currentDropPiece.xPos,
              currentDropPiece.yPos,
              pieceWidth,
              pieceHeight
            );
            stage.restore();
          }
        }
      }
      stage.save();
      stage.globalAlpha = 0.6;
      stage.drawImage(
        img,
        currentPiece.sx,
        currentPiece.sy,
        pieceWidth,
        pieceHeight,
        mouse.x - pieceWidth / 2,
        mouse.y - pieceHeight / 2,
        pieceWidth,
        pieceHeight
      );
      stage.restore();
      stage.strokeRect(
        mouse.x - pieceWidth / 2,
        mouse.y - pieceHeight / 2,
        pieceWidth,
        pieceHeight
      );
    }

    function onPuzzleClick(e) {
      if (e.layerX || e.layerX === 0) {
        mouse.x = e.layerX - canvas.offsetLeft;
        mouse.y = e.layerY - canvas.offsetTop;
      } else if (e.offsetX || e.offsetX === 0) {
        mouse.x = e.offsetX - canvas.offsetLeft;
        mouse.y = e.offsetY - canvas.offsetTop;
      }
      currentPiece = checkPieceClicked();
      if (currentPiece !== null) {
        stage.clearRect(
          currentPiece.xPos,
          currentPiece.yPos,
          pieceWidth,
          pieceHeight
        );
        stage.save();
        stage.globalAlpha = 0.9;
        stage.drawImage(
          img,
          currentPiece.sx,
          currentPiece.sy,
          pieceWidth,
          pieceHeight,
          mouse.x - pieceWidth / 2,
          mouse.y - pieceHeight / 2,
          pieceWidth,
          pieceHeight
        );
        stage.restore();
        document.onpointermove = updatePuzzle;
        document.onpointerup = pieceDropped;
      }
    }

    function gameOver() {
      document.onpointerdown = null;
      document.onpointermove = null;
      document.onpointerup = null;
      initPuzzle();
    }

    function pieceDropped(e) {
      document.onpointermove = null;
      document.onpointerup = null;
      if (currentDropPiece !== null) {
        let tmp = {
          xPos: currentPiece.xPos,
          yPos: currentPiece.yPos,
        };
        currentPiece.xPos = currentDropPiece.xPos;
        currentPiece.yPos = currentDropPiece.yPos;
        currentDropPiece.xPos = tmp.xPos;
        currentDropPiece.yPos = tmp.yPos;
      }
      resetPuzzleAndCheckWin();
    }

    function resetPuzzleAndCheckWin() {
      stage.clearRect(0, 0, puzzleWidth, puzzleHeight);
      let gameWin = true;
      for (piece of pieces) {
        stage.drawImage(
          img,
          piece.sx,
          piece.sy,
          pieceWidth,
          pieceHeight,
          piece.xPos,
          piece.yPos,
          pieceWidth,
          pieceHeight
        );
        stage.strokeRect(piece.xPos, piece.yPos, pieceWidth, pieceHeight);
        if (piece.xPos != piece.sx || piece.yPos != piece.sy) {
          gameWin = false;
        }
      }
      if (gameWin) {
        setTimeout(gameOver, 500);
        setIsActive(false);
        setToaster(true);
        // document.getElementById("prompt").classList.toggle("hidden");
        // document.getElementById("prompt").style.display = "flex";

      }
    }

    function shuffleArray(o) {
      for (
        var j, x, i = o.length;
        i;
        j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x
      );
      return o;
    }

    function updateSize(e) {
      size = e.target.value;
      pieceWidth = Math.floor(img.width / size);
      pieceHeight = Math.floor(img.height / size);
      puzzleWidth = pieceWidth * size;
      puzzleHeight = pieceHeight * size;
      gameOver();
    }
    document.querySelector("#size").oninput = updateSize;
  }, []);

  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
    const time = document.getElementById("timer");
    time.style.display = "block";

    const startTime = document.getElementById("str");
    startTime.style.opacity = 0;
  }

  function reset() {
    setSeconds(0);
    setIsActive(false);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  useEffect(() => {
    if (toaster === true) {
      notify();
    }
  }, [toaster]);

  return (
    <div className={`styles.container`}>
      <Head>
        <title>Image Puzzle</title>
        <link rel="icon" href="/favicon.png" />
      </Head>
      {toaster && (
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      )}


      <div className="flex flex-col justify-center items-center gap-3 pt-10">
        <h1
          className="sm:text-3xl sm:font-bold sm:leading-none text-center sm:mb-4 text-xl font-bold mb-2
"
        >
          Enter a Number between 2-6
        </h1>
        <input
          type={`text`}
          placeholder={`Enter a number`}
          className={`sm:py-3 py-2 sm:px-8 px-5 border border-slate-800 rounded-lg sm:w-[400px] w-[250px]`}
          id="size"
        />
        <canvas id="canvas"></canvas>

        <div className="relative">
          <div className="flex sm:flex-row flex-col justify-center items-center mt-3 sm:gap-3 gap-2">
            <button
              id="str"
              className="text-white opacity-100 sm:text-lg text-xs font-medium bg-green-700 hover:bg-green-900 rounded sm:py-3 py-2 sm:px-10 px-6  border border-green-900"
              onClick={toggle}
            >
              START
            </button>

            <button
              className="bg-blue-600 hover:bg-blue-800 sm:py-[14px] py-2 sm:ml-4 sm:px-6 px-3 rounded border border-blue-600 sm:text-base text-xs font-bold"
              onClick={() => {
                Router.reload("/puzzle");
              }}
            >
              Try a different Picture
            </button>
          </div>
          <div
            id="timer"
            className="absolute top-3 sm:top-3 left-12 hidden sm:left-5 sm:py-3 py-2 sm:px-10 px-6 bg-slate-400 border-slate-800 sm:text-lg text-xs font-medium rounded-lg"
          >
            {seconds}s
          </div>
        </div>
        <div
          id="prompt"
          className="absolute hidden sm:text-xl md:text-2xl pt-2 sm:pt-8 text-sm text-center flex-col 2xl:gap-4 justify-center items-center bg-green-400 sm:w-[450px] lg:w-[900px] md:w-[650px] w-[280px] sm:h-[200px] md:h-[280px] 2xl:h-[400px]  h-[200px] rounded-lg border border-slate-700 opacity-100"
        >
          <span className={`font-bold`}> Welcome to The AK&apos;s Team </span>
          <br></br>
          You solved the puzzle in {seconds} seconds <br></br>
          <button
            className="bg-red-400 hover:bg-red-500 sm:py-3 py-2 sm:px-6 px-4 rounded-lg border border-red-700 sm:text-base mt-2 sm:mt-4 text-xs font-bold"
            onClick={() => {
              localStorage.setItem('timer', seconds)
              Router.reload("/puzzle");
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}
