export const Table = ({ openModal, setOpenModal }) => {
  return (
    <div
      className={
        openModal
          ? `border-l translate-x-0 fixed top-0 right-0 bg-white transition-all duration-500 z-[2100] h-screen w-[50%] max-md:w-full`
          : `border-l translate-x-full fixed top-0 right-0 bg-white transition-all duration-500 z-[2100] h-screen w-[50%] max-md:w-full`
      }
    >
      <div className={`p-5 overflow-y-auto h-full`}>
        <div className="flex space-between">
        <h2 className={`text-[1.2rem] text-center w-full pb-2 `}>
          Tabele mera (gornji deo)
        </h2>
        <button className="text-2xl" onClick={() => setOpenModal(!openModal)}>
          X
        </button>
        </div>

        <div className={`md:mt-10 items-center`}>
          <table className={`w-full h-[300px] md:h-56`}>
            <thead>
              <tr className={`border`}>
                <th className={`text-center border-2 border-solid border-black font-normal pl-2`}>Jedinica mere cm</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>XS</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>S</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>M</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>L</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>XL</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border !py-2`}>
                <td className={`text-center border-2 border-solid border-black py-2 pl-2 font-bold`}>Obim grudi</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>80-84</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>84-88</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>88-92</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>92-96</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>98-102</td>
              </tr>
              <tr className={`border !py-2`}>
                <td className={`text-center border-2 border-solid border-black py-2 font-bold pl-2`}>Obim struka</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>60-64</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>64-68</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>68-72</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>72-76</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>78-82</td>
              </tr>
              <tr className={`border !py-2 `}>
                <td className={`text-center border-2 border-solid border-black pl-2 py-2 font-bold`}>Obim kukova</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>88-92</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>92-96</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>96-100</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>100-104</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>106-110</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className={`text-[1.2rem] mt-10 w-full text-center pb-2 `}>
          Tabele mera za žene (donji deo)
        </h2>
        <div className={`md:mt-10 items-center`}>
          <table className={`w-full h-[200px] md:h-44`}>
            <thead>
              <tr className={`border`}>
                <th className={`text-center border-2 border-solid border-black font-normal`}>Jedinica mere cm</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>34</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>36</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>38</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>40</th>
                <th className={`text-center border-2 border-solid border-black whitespace-nowrap`}>42</th>
              </tr>
            </thead>
            <tbody>
              <tr className={`border !py-2 `}>
                <td className={`text-center border-2 border-solid border-black py-2 font-bold p-2`}>Obim struka</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>62-65</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>65-68</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>68-72</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>71-74</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>74-78</td>
              </tr>
              <tr className={`border !py-2`}>
                <td className={`text-center border-2 border-solid border-black py-2 pl-2 font-bold`}>Obim kukova</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>90-93</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>93-96</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>96-99</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>99-102</td>
                <td className={`text-center border-2 border-solid border-black whitespace-nowrap`}>102-106</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
