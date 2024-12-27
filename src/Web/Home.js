// import { Link } from "react-router-dom"
import { IoSearch } from 'react-icons/io5';
export default function Home() {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-1/2 grid grid-col2 m-10">
        <div className="w-full flex flex-col justify-start items-center
                        text-xl m-2 p-2">
          <div className='search'>
            <div className='search-bar'>
              <input type="text"  placeholder='키워드를 입력하세요.'/>
                <div><IoSearch /></div>
            </div>
          </div>
          {/* <ul>
            <li><Link to='/detail?id=🥐'>빵🥐</Link></li>
            <li><Link to='/detail?id=🍕'>피자🍕</Link></li>
            <li><Link to='/detail?id=🍔'>햄버거🍔</Link></li>
          </ul> */}
        </div>
      </div>
    </div>
  )
}
