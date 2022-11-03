import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [can, setCan] = useState();

  useEffect(() => {
    const PUZZLE_HOVER_TINT = "#009900";
    const img = new Image();
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
    img.src = "https://external-preview.redd.it/GZf1OJHNxY0fxShKsxeDXK0bVrzw5S1QCN_jt2kEkrE.png?format=pjpg&auto=webp&s=36552f92a5caf2f5a920aa3df3ac97947793a717";

    function initPuzzle() {
      pieces = [];
      mouse = {
        x: 0,
        y: 0
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
      createTitle("Create Puzzle");
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

    function createTitle(msg) {
      stage.fillStyle = "#000000";
      stage.globalAlpha = 0.4;
      stage.fillRect(100, puzzleHeight - 40, puzzleWidth - 200, 40);
      stage.fillStyle = "#FFFFFF";
      stage.globalAlpha = 1;
      stage.textAlign = "center";
      stage.textBaseline = "middle";
      stage.font = "20px Arial";
      stage.fillText(msg, puzzleWidth / 2, puzzleHeight - 20);
    }

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
      document.onpointerdown = shufflePuzzle;
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
          yPos: currentPiece.yPos
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Image Puzzle</title>
      </Head>
      <div className="flex flex-col justify-center items-center gap-6 pt-10">
        <h1 className="text-3xl font-bold leading-none text-center mb-4">Enter a Number between 2-6</h1>
        <input type={`text`} placeholder={`Enter a number`} className={`py-3 px-8 border border-slate-800 rounded-lg w-[400px]`} id="size" />
        <canvas id="canvas"></canvas>
      </div>
    </div>
  );
}
