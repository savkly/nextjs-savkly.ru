"use client";

import Image from "next/image";

export default function Home() {

  return (
    <div className="grid place-content-center h-full">
      <div className="flex flex-col px-3 md:flex-row md:px-0 md:items-center">
        <Image src='./img/savkly.png' width={310} height={354} alt="SavKly" />
        <div className="border p-2 rounded-md">
          <p>Привет, данный сайт находиться на стадии разработки...</p>
          <a href="https://savkly.ru">Основной сайт</a><br />
          <a href="https://portfolio.savkly.ru">Открыть моё портфолио</a>
        </div>
      </div>
    </div>
  );
}
