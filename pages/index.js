import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link"

export default function Home() {
  const [num, setNum] = useState(0);
  const [arr, setArr] = useState([]);

  const dragItem = useRef();
  const dragOverItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
    console.log(e.target.innerHTML);
  };

  const dragEnter = (e, position) => {
    dragOverItem.current = position;
    console.log(e.target.innerHTML);
  };

  const drop = (e) => {
    const copyListItems = [...arr];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;

    setArr(copyListItems);

    setTimeout(() => {
      let welcome = copyListItems.filter((item, index) => {
        if (item.id !== index + 1) {
          return;
        } else {
          return item;
        }
      });
      if (welcome.length == copyListItems.length) {
        alert("Welcome to the team");
      }
    }, 500);
  };

  const handleChange = (event) => {
    setNum(event.target.value);
    console.log("value is:", event.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();
    const item = new Array(parseInt(num * num)).fill(0).map((item, idx) => {
      return {
        id: idx + 1,
      };
    });
    let itemTwo = item
      .map((number, idx) => {
        return {
          id: number.id,
          sort: Math.random(),
        };
      })
      .sort(function (a, b) {
        return a.sort - b.sort;
      });
    console.log(itemTwo);
    setArr([...itemTwo]);

    console.log(num);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Puzzle App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <div className="App pt-10 text-center flex flex-col justify-center items-center">
        <input
          type="text"
          value={`Create My Puzzle`}
          className="py-4 px-10 border border-slate-300 rounded-lg mb-4"
          ref={inputRef}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="button"
          value="Load my Puzzle"
          className="py-4 px-10 rounded-lg bordre border-slate-500 bg-slate-900 text-white ml-4 mb-6"
          onClick={(e) => setRedraw(!redraw)}
        />
        <canvas id="canvas" ref={canvasRef}></canvas>
      </div> */}
      <div className="flex w-[57%] justify-between float-right items-center">
        <h1 className="text-4xl font-bold leading-none py-10 text-center">
          Grid Puzzle
        </h1>
        <div className="float-right">

          <Link href={`/puzzle`}>
            <button className="relative py-3 pr-6 rounded-lg bg-green-400 text-black border border-green-500 w-[200px] float-right">Next Puzzle</button>
            <img src="./assets/next.png" className="w-[20px] h-[20px] absolute right-[53px] top-[3rem]" />
          </Link>
        </div>

      </div>
      <form
        onSubmit={(e) => {
          handleClick(e);
        }}
        className="w-full flex flex-row gap-4 justify-center items-center p-10 border border-slate-300 rounded-lg bg-slate-50"
      >
        <p className="text-xl font-medium leading-none text-slate-900">
          Enter the required grid length:
        </p>
        <input
          type={`text`}
          onChange={(e) => setNum(e.target.value)}
          id="num"
          className="py-2 px-4 w-[400px] rounded-lg border border-slate-300"
          placeholder="Enter a number"
        />
        <button
          type="submit"
          className="bg-blue-700 text-white py-2 px-6 rounded-lg f-f-m"
        >
          Enter
        </button>
      </form>
      <div
        style={{ gridTemplateColumns: `repeat(${num},minmax(0,1fr))` }}
        className={`grid`}
      >
        {arr &&
          arr.map((item, idx) => {
            return (
              <div
                draggable="true"
                className="cursor-move py-16 gap-3 text-center mt-10 mr-4 text
                -2xl font-bold bg-slate-200 rounded border border-slate-600"
                onDragStart={(e) => dragStart(e, idx)}
                onDragEnter={(e) => dragEnter(e, idx)}
                onDragEnd={drop}
                key={idx}
              >
                {item.id}
              </div>
            );
          })}
      </div>
    </div>
  );
}
