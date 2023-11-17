import React from "react";

export const Page = ({page, fetchSinglePage}) => {
  return (
    <>
      <h3 className="link" onClick={() =>fetchSinglePage(page.slug)}>{page.title}</h3>
    </>
  );
};