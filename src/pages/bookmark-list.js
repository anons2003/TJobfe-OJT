import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NavbarDark from "../components/navbarDark";
import api from "../api/http";
import { Link } from "react-router-dom";

const fetchBookmarkedJobs = async () => {
  const token = sessionStorage.getItem("token");
  const { data } = await axios.get(
    "https://topjob-ojt-790cf940c139.herokuapp.com/jobSeeker/bookmarks",
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return data;
};

//Format date time array
const formatDateTime = (dateArray) => {
  const [year, month, day, hour, minute, second, nanosecond] = dateArray;
  const millisecond = Math.floor(nanosecond / 1000000);
  return new Date(year, month - 1, day, hour, minute, second, millisecond);
};

const compareWithCurrentDate = (date) => {
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return diffDays;
};

const BookmarksList = () => {
  const queryClient = useQueryClient();

  const unbookmarkMutation = useMutation({
    mutationFn: (jobId) => {
      const token = sessionStorage.getItem("token");
      return api.delete(`/jobSeeker/job/${jobId}`, {
        headers: {
          Authorization: token,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries("bookmarkedJobs");
    },
  });

  const { data, error, isLoading } = useQuery({
    queryKey: ["bookmarkedJobs"],
    queryFn: fetchBookmarkedJobs,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Ensure data is not undefined
  const bookmarks = data || [];

  return (
    <>
      <NavbarDark navClass="defaultscroll sticky" navLight={true} />

      <section className="section">
        <div className="container">
          <h2 className="my-4">Bookmarked Jobs</h2>
          <div className="list-group">
            {bookmarks.map((bookmark) => {
              const createdAtDate = formatDateTime(bookmark.createdDate);
              const daysAgo = compareWithCurrentDate(createdAtDate);

              return (
                <div
                  key={bookmark.id}
                  className="list-group-item list-group-item-action flex-column align-items-start"
                >
                  <div className="row align-items-center">
                    <div className="col-md-1">
                      <Link to={`/employer-profile/${bookmark.enterprise.eid}`}>
                        <img
                          src={bookmark.enterprise.avatar_url}
                          className="avatar avatar-small rounded shadow bg-white"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="col-md-10">
                      <div className="d-flex w-100 justify-content-between">
                        <Link
                          to={`/job-detail-three/${bookmark.id}`}
                          className="text text-dark"
                        >
                          <h5 className="mb-1">{bookmark.title}</h5>
                        </Link>
                        <small>Posted: {daysAgo} days ago</small>
                      </div>
                      <p className="mb-1">{bookmark.description}</p>
                      <small>Require Skill: {bookmark.skills}</small>
                      <div className="d-flex w-100 justify-content-between mt-2">
                        <small>
                          {bookmark.address}, {bookmark.state},{" "}
                          {bookmark.country}
                        </small>
                        <small>
                          Salary: {bookmark.minSalary} - {bookmark.maxSalary}{" "}
                          {bookmark.salaryType}
                        </small>
                      </div>
                    </div>
                    <div className="col-md-1 d-flex justify-content-end">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => unbookmarkMutation.mutate(bookmark.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default BookmarksList;
