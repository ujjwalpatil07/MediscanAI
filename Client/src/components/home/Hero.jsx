import heroImg from "../../../../Assets/heroImg.png"
import SearchIcon from '@mui/icons-material/Search';
import EastIcon from '@mui/icons-material/East';
import PhoneIcon from '@mui/icons-material/Phone';

export default function Hero() {
  return (
    <section className="flex flex-col-reverse md:flex-row items-center justify-between  gap-8">
      <div className="md:w-1/2 space-y-4">
        <h1 className="text-3xl md:text-5xl font-semibold text-neutral-800 dark:text-white">
          <span className="text-primary font-bold" >Your Health, Our Priority -</span> <br /> Experience Care Like Never Before!
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-lg md:text-xl ">
          We use only the best quality materials on the market in order to provide the best products to our patients, So don’t worry about anything and book yourself.
        </p>
        <div className="flex gap-3">
          <button className="px-6 py-3 bg-primary text-white rounded-lg">
            Make an Appointment
          </button>
          <button className="p-1 border border-primary text-primary rounded-lg flex items-center">
            <span className="bg-gradient-to-b from-[#1A815130] to-[#1ba86610] rounded-lg p-2"><PhoneIcon /></span>
          </button>
          <div className="flex flex-col px-4 text-sm justify-center">
            <p className="text-[#1C4532] font-medium">24 x 7 Emergency</p>
            <p>0900-78601</p>
          </div>
        </div>

        <div className="py-1 ps-3 pe-1 border-2 border-primary w-100 rounded-full flex items-center justify-between"> 
          <div>
            <SearchIcon />
            <input
              type="text"
              name="heroSearch"
              id="heroSearch"
              placeholder="Search for doctor..."
              className="ms-2 focus:outline-none focus:ring-0"
            />
          </div>
          <button className="ps-5 pe-3 py-2 bg-primary text-white rounded-full">
            Search <EastIcon fontSize="small"/>
          </button>
        </div>

      </div>

      <div className="w-120 py-6">
        <img
          src={heroImg}
          className="w-full "
          alt="doctor"
        />
      </div>
    </section>
  );
}

