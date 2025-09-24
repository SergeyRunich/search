import React from "react";
import Head from "next/head";
import Search from "../components/Search";

export default function Home() {
  return (
    <>
      <Head>
        <title>Search demo — Test task</title>
      </Head>
      <main style={{ padding: 24, maxWidth: 1024, margin: "0 auto" }}>
        <h1>Search Demo</h1>
        <Search />
      </main>
    </>
  );
}
