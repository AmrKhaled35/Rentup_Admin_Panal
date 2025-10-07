const FacilityItem = ({icon, title, value}) => {
    return (
      <div className="flex justify-normal items-center gap-6">
        <div className="size-6 border border-[#3B3B3B]/25 rounded-md p-1 flex justify-center items-center">
          <img src={icon} alt="#" width={16} height={16} />
        </div>
        <div className="grid grid-cols-2 items-center">
          <p className="text-gray55 text-sm font-semibold">{title}</p>
          <p>
            <span className="text-sm font-bold text-gray55 mr-6">:</span>
            <span className="text-sm text-gray55 font-light">
              {value}
            </span>
          </p>
        </div>
      </div>
    )
  }
  
  export default FacilityItem