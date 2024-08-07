import React, { useEffect, useState } from "react"
import {
  AiOutlineClose,
  AiOutlineMenu,
  AiOutlineShoppingCart,
} from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { Link, matchPath, useLocation, useNavigate } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
import { categories } from "../../services/apis"
import { logout } from "../../services/operations/authAPI"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"
import SidebarLink from "../core/Dashboard/SidebarLink"
import ConfirmationModal from "./ConfirmationModal"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [confirmationModal, setConfirmationModal] = useState(null)
  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  useEffect(() => {
    const fetchSubLinks = async () => {
      setLoading(true)
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API)
        if (Array.isArray(res.data.data)) {
          setSubLinks(res.data.data)
        } else {
          console.error("Unexpected response format")
        }
      } catch (error) {
        console.error("Could not fetch Categories.", error)
      }
      setLoading(false)
    }
    fetchSubLinks()
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.height = "100vh"
    } else {
      document.body.style.height = "max-content"
    }
  }, [isMobileMenuOpen])
  const matchRoute = (route) => matchPath({ path: route }, location.pathname)

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false)
  }

  const handleProfileDropdownToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen)
    if (isMobileMenuOpen) setIsMobileMenuOpen(false)
  }

  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            width={160}
            height={32}
            loading="lazy"
            className="object-cover"
          />
        </Link>
        {/* Desktop Navigation links */}
        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoute("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{link.title}</p>
                    <BsChevronDown />
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : subLinks.length ? (
                        subLinks
                          .filter(
                            (subLink) =>
                              subLink.courses && subLink.courses.length > 0
                          )
                          .map((subLink, i) => (
                            <Link
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                              key={i}
                            >
                              <p>{subLink.name}</p>
                            </Link>
                          ))
                      ) : (
                        <p className="text-center">No Courses Found</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link.path}>
                    <p
                      className={`${
                        matchRoute(link.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation links */}
        <div className="flex items-center md:hidden">
          <button onClick={handleMobileMenuToggle} className="z-50">
            {isMobileMenuOpen ? (
              <AiOutlineClose fontSize={24} fill="#AFB2BF" />
            ) : token ? (
              <img
                src={user?.image}
                alt={`profile-${user?.firstName}`}
                className="aspect-square w-[30px] rounded-full object-cover"
              />
            ) : (
              <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
            )}
          </button>
        </div>
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className={`fixed right-0 top-0 z-40 h-full bg-richblack-800 p-4 ${
              isMobileMenuOpen ? "w-full opacity-100" : "w-0 opacity-0"
            } md:hidden`}
          >
            <ul className="mt-14 flex flex-col gap-y-4 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div className="w-full">
                      {loading ? (
                        <p>Loading...</p>
                      ) : subLinks.length ? (
                        <select
                          className="mt-2 w-full rounded-lg border border-richblack-700 bg-richblack-800 py-2 text-yellow-25 focus:outline-none focus:ring-2 focus:ring-yellow-25"
                          onChange={(e) => {
                            const selectedSubLink = subLinks.find(
                              (subLink) =>
                                subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase() === e.target.value
                            )
                            if (selectedSubLink) {
                              handleMobileMenuToggle()
                              navigate(`/catalog/${e.target.value}`)
                            }
                          }}
                        >
                          <option value="" disabled selected>
                            Catalog
                          </option>
                          {subLinks
                            .filter(
                              (subLink) =>
                                subLink.courses && subLink.courses.length > 0
                            )
                            .map((subLink, i) => (
                              <option
                                key={i}
                                value={subLink.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}
                              >
                                {subLink.name}
                              </option>
                            ))}
                        </select>
                      ) : (
                        <p>No Courses Found</p>
                      )}
                    </div>
                  ) : (
                    <Link to={link.path} onClick={handleMobileMenuToggle}>
                      <p
                        className={`${
                          matchRoute(link.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}

              {/* Login / Signup for Mobile */}
              {token === null ? (
                <>
                  <Link to="/login" onClick={handleMobileMenuToggle}>
                    <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-left text-richblack-100">
                      Log in
                    </button>
                  </Link>
                  <Link to="/signup" onClick={handleMobileMenuToggle}>
                    <button className="w-full rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-left text-richblack-100">
                      Sign up
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard/my-profile"
                    onClick={handleMobileMenuToggle}
                  >
                    <p className="text-white">Dashboard</p>
                  </Link>
                  <SidebarLink
                    link={{ name: "My Courses", path: "/dashboard/my-courses" }}
                    iconName="VscVm"
                  />
                  {user.accountType !== "Instructor" && (
                    <SidebarLink
                      link={{
                        name: "Enrolled Courses",
                        path: "/dashboard/enrolled-courses",
                      }}
                      iconName="VscMortarBoard"
                    />
                  )}
                  {user.accountType !== "Student" && (
                    <SidebarLink
                      link={{
                        name: "Add Course",
                        path: "/dashboard/add-course",
                      }}
                      iconName="VscAdd"
                    />
                  )}

                  <div className="flex flex-col">
                    <SidebarLink
                      link={{ name: "Settings", path: "/dashboard/settings" }}
                      iconName="VscSettingsGear"
                    />
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Are you sure?",
                          text2: "You will be logged out of your account.",
                          btn1Text: "Logout",
                          btn2Text: "Cancel",
                          btn1Handler: () => {
                            dispatch(logout(navigate))
                            handleMobileMenuToggle()
                            setConfirmationModal(null) // Close modal after logout
                          },
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                      className="px-8 py-2 text-sm font-medium text-richblack-300"
                    >
                      <div className="flex items-center gap-x-2">
                        <VscSignOut className="text-lg" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </>
              )}
            </ul>

            {confirmationModal && (
              <ConfirmationModal modalData={confirmationModal} />
            )}
          </div>
        )}
        {/* Login / Signup / Dashboard */}
        <div className="hidden items-center gap-x-4 md:flex">
          {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null ? (
            <>
              <Link to="/login">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Log in
                </button>
              </Link>
              <Link to="/signup">
                <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100">
                  Sign up
                </button>
              </Link>
            </>
          ) : (
            <>
              <div onClick={handleProfileDropdownToggle}>
                <ProfileDropdown />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
