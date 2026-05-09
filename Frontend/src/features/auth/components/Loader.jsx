import { LifeLine } from "react-loading-indicators";

const Loader = () => {
  return (
    <div className="page-loader">
      <div className="page-loader__backdrop" />

      <div className="page-loader__content">
        <LifeLine color="#0b48b6" size="medium" text="" textColor="" />
      </div>
    </div>
  );
};

export default Loader;
