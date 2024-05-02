import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[];
};

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  try {
    const res = await fetch("http://localhost:3000/users", { method: "GET" });
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [] } };
    }

    return {
      props: { statusCode: 200, users: await res.json() },
    };
  } catch (e) {
    return { props: { statusCode: 500, users: [] } };
  }
}) satisfies GetServerSideProps<TGetServerSideProps>;

export default function Home({ statusCode, users }: TGetServerSideProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 20;
  const totalAmountOfPages = Math.ceil(users.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const pagesToShow = 10;
  const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
  const endPage = Math.min(totalAmountOfPages, startPage + pagesToShow - 1);

  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.Prev
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            />
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <Pagination.Item key={page} active={page === currentPage} onClick={() => setCurrentPage(page)}>
                {page}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage(Math.min(totalAmountOfPages, currentPage + 1))}
              disabled={currentPage === totalAmountOfPages}
            />
          </Pagination>
        </Container>
      </main>
    </>
  );
}
