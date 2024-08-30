import { NextPage } from "next";
import Error from "next/error";

interface Props {
  statusCode?: number;
}

const Page: NextPage<Props> = ({ statusCode }) => {
  return <Error statusCode={statusCode || 500} />;
}

Page.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 500 as number;
  return { statusCode };
}

export default Page;
