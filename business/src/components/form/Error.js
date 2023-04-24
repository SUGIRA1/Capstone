import React from "react";

const Error = ({ errorName }) => {
  return (
    <>
      {errorName && (
        <span className="form-error mt-2">
          {errorName.message}
          <br />
          <br />
        </span>
      )}
    </>
  );
};

export default Error;
