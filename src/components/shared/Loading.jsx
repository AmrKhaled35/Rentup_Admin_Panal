const Loading = () => {
  return (
    <div className="w-full mx-auto my-20">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        margin: "auto",
        display: "block",
        shapeRendering: "auto",
      }}
      className="w-[75px] lg:w-[100px] h-[75px] lg:h-[100px]"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <circle
        cx="50"
        cy="50"
        r="35"
        strokeWidth="8"
        stroke="#22C55E"
        strokeDasharray="54.97787143782138 54.97787143782138"
        fill="none"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="2.4390243902439024s"
          repeatCount="indefinite"
          keyTimes="0;1"
          values="0 50 50;360 50 50"
        ></animateTransform>
      </circle>
      <circle
        cx="50"
        cy="50"
        r="26"
        strokeWidth="8"
        stroke="#22C55E"
        strokeDasharray="40.840704496667314 40.840704496667314"
        strokeDashoffset="40.840704496667314"
        fill="none"
        strokeLinecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="2.4390243902439024s"
          repeatCount="indefinite"
          keyTimes="0;1"
          values="0 50 50;-360 50 50"
        ></animateTransform>
      </circle>
    </svg>
  </div>
  )
}

export default Loading
  