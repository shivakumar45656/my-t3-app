import { useEffect, useState } from "react";
import Header from "../../components/header";

import { api } from "~/utils/api";

export let token: string = "";

export default function catalogue() {
  const [currentPage, setCurrentPage] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [currentItems, setcurremtItems] = useState([]);
  const itemsPerPage = 10;

  const catelogueResult = api.catalogue.list.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 1, // <-- optional you can pass an initialCursor
    },
  );
  const catologueAddApi = api.catalogue.add.useMutation();
  const catologueRemoveApi = api.catalogue.remove.useMutation();
  const userLogoutApi = api.user.logout.useMutation();

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  useEffect(() => {
    const data = catelogueResult.data?.pages[currentPage]?.items ?? [];
    if (data.length > 0) {
      setcurremtItems(data);
    }
  }, [catelogueResult.data, currentPage]);

  useEffect(() => {
    if (catelogueResult.status === "error") {
      location.href = "/signup";
    }
  }, [catelogueResult.status]);

  const addORRemove = async (event: any, item: any) => {
    let checkedState = event.target.checked;
    console.log(event);
    let catId = Number(event.target.value);
    if (checkedState) {
      catologueAddApi.mutate(
        {
          category_id: catId,
        },
        {
          onSettled(data, error) {
            if (error) {
              setErrMsg(error.message);
            } else if (data && data.status === 201) {
              item.selected = true;
            }
          },
        },
      );
    } else {
      catologueRemoveApi.mutate(
        {
          category_id: catId,
        },
        {
          onSettled(data, error) {
            if (error) {
              setErrMsg(error.message);
            } else if (data?.status === 200) {
              item.selected = false;
            }
          },
        },
      );
    }
  };
  const handlePrev = async () => {
    console.log(currentPage);
    if (currentPage > 0) {
      catelogueResult.fetchPreviousPage();
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNext = async () => {
    catelogueResult.fetchNextPage();
    setCurrentPage(currentPage + 1);
  };
  const logout = async () => {
    userLogoutApi.mutate(
      // @ts-ignore: empty obj needed
      {},
      {
        onSuccess(data, error) {
          if (data && data.status === 200) {
            location.href = "/login";
          }
        },
      },
    );
  };
  return (
    <>
      <Header />
      <div className="create-account">
        <div className="create-account-body">
          <div className="banner">
            <b style={{ fontSize: "small" }}>Get 10% off on business sign up</b>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              padding: "0 300px",
            }}
          >
            <button
              style={{
                border: "1px solid #c1c1c1",
                borderRadius: 8,
                padding: 4,
              }}
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
          <div className="container">
            <div className="formContainer">
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h1
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "20px",
                  }}
                >
                  Please mark your interests!
                </h1>
                {/* <p style={{ marginTop: "20px", fontWeight: 500 }}> </p> */}
                <small style={{ fontWeight: "400", marginTop: "5px" }}>
                  {" "}
                  We will keep you notified.{" "}
                </small>
              </div>
              <form onSubmit={() => {}} className="form">
                <h2>My saved interests!</h2>
                {currentItems &&
                  currentItems.map((item: any, index: number) => (
                    <div key={item.id}>
                      <input
                        type="checkbox"
                        id={item.name}
                        name={item.name}
                        value={item.id}
                        onClick={(event) => addORRemove(event, item)}
                        checked={item.selected}
                      />
                      <label htmlFor="vehicle1"> {item.name}</label>
                    </div>
                  ))}
              </form>
              <hr></hr>
              <div className="footer" style={{}}>
                <button
                  disabled={currentPage === 0}
                  onClick={handlePrev}
                  style={{ cursor: "pointer", marginRight: "2px" }}
                >
                  {" "}
                  &lt;{" "}
                </button>
                <button
                  disabled={catelogueResult.hasNextPage === false}
                  onClick={handleNext}
                  style={{ cursor: "pointer", marginLeft: "2px" }}
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
