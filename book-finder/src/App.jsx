import { useEffect, useState } from 'react'
import axios from 'axios';
import './App.css'

//Candidate ID: Naukri0925
function App() {
  const [name, setName] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errm, setErrm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const newData = await axios.get('https://openlibrary.org/trending/monthly.json');//got this api type from chat gpt
      console.log(newData.data);
      setData(newData.data.works);
      setError(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrm("Something went Wrong ....");
      console.log(err)
    }
  }

  useEffect(() => {
    loadData();
  }, [])


  async function search() {
    if (name.trim() !== "") {
      try {
        setLoading(true);
        const newData = await axios.get(`https://openlibrary.org/search.json?title={${name.trim().toLocaleLowerCase()}}`);
        console.log(newData);
        if (newData.status === 200) {
          setData(newData.data.docs);
          setError(false);
        }
        else {
          setErrm("Book Not Found");
          setError(true);
          setData([]);
        }
      } catch (err) {
        setError(true);
        setErrm(err);
      }
      setLoading(false);
    }
    else {
      loadData();
    }

  }


  return (
    <>
      <div className='parent'>
        <div className='Heading'>
          <h1>Book Finder</h1>
        </div>
        <div className='search'>
          <input type="text" className='input-field' placeholder='Enter Book Name ' value={name} onChange={(e) => setName(e.target.value)} />
          <button className='search-button' onClick={search}>🔍</button>
        </div>
        {loading ? (<h2>Loading ...</h2>) : (<></>)}
        {error ? (<h2 > {String(errm)}</h2>) : (<></>)}
        <div className="container">


          {data.slice(0, 30).map((item, index) => (
            <div key={index} className="book">
              <h3 className='title' >{item.title.length > 50 ? item.title.slice(0, 50) + "..." : item.title}</h3>
              {item.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`}
                  alt={item.title}
                  className='image'
                />
              ) : (
                <p className='alternate-text'>No cover available  </p>
              )}
            </div>
          ))}
        </div>



      </div>
    </>
  )
}

export default App
