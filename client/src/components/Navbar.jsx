import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Typography } from "antd";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/profile", {
          withCredentials: true,
        });
        /* response.data:
        {username: 'Deepu', id: '6640615177563c43969815f9', iat: 1715526681}
         */
        setUserInfo(response.data);
        // Why reasigning userInfo although its assigned in Login.jsx? :
        // When user refreshes the userInfo gets reinitialised to empty as declared in UserContext.js
      } catch (e) {
        console.log(e);
      }
    };

    fetchData(); // Call the inner async function
  }, []);

  async function logout() {
    try {
      // Clears the token cookie in Server-side
      await axios.post("http://localhost:4000/logout", {
        withCredentials: true,
      });
      setUserInfo(null);
      // Clears the token cookie on the client-side
      Cookies.remove("token");
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  }

  const { Title } = Typography;
  const location = useLocation();

  // List of pages and their associated paths
  const pages = [
    { name: "Home", path: "/" },
    { name: "Characters", path: "/characters" },
    { name: "Community", path: "/community" },
  ];

  const unauthorisedPages = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" },
  ];

  // We get username only if user existes and is logged in.
  const username = userInfo?.username;

  return (
    <div className="navbar">
      <Row>
        <Col span={8}>
          <Title className="item1" level={4}>
            OnePiece
          </Title>
        </Col>
        <Col className="navbar-items" span={16}>
          {/* Base pages */}
          {pages.map((page) => (
            <Title
              key={page.name}
              className={
                location.pathname === page.path ? "item current-page" : "item"
              }
              level={4}
            >
              <Link className="link" to={page.path}>
                {page.name}
              </Link>
            </Title>
          ))}

          {/* Authorised pages */}
          {username && (
            <>
              <Title
                key={"createpost"}
                className={
                  location.pathname === "/create" ? "item current-page" : "item"
                }
                level={4}
              >
                <Link className="link" to="/create">
                  Create post
                </Link>
              </Title>
              <Title
                key={"logout"}
                className={
                  location.pathname === "/logout" ? "item current-page" : "item"
                }
                level={4}
              >
                <a className="link" onClick={logout}>
                  Logout
                </a>
              </Title>
            </>
          )}

          {/* Unauthorised pages */}
          {!username && (
            <>
              {unauthorisedPages.map((page) => (
                <Title
                  key={page.name}
                  className={
                    location.pathname === page.path
                      ? "item current-page"
                      : "item"
                  }
                  level={4}
                >
                  <Link className="link" to={page.path}>
                    {page.name}
                  </Link>
                </Title>
              ))}
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Navbar;
