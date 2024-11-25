import { useEffect, useState } from "react";
import Offer from "../Offer";
import "./style.css";
import { findOfferByUserUid } from "../../services/OfferService";
import { useAuth } from "../../context/AuthContext";

const OfferList = () => {
  const { user } = useAuth();

  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchWorkDay, setSearchWorkDay] = useState(""); 
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsubscribe = findOfferByUserUid(user ? user.uid : null, (data) => {
      setOffers(data);
      setFilteredOffers(data);
      setLoading(false)
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    const filtered = offers.filter((offer) => {
      const title = offer.title?.toLowerCase() || "";
      const province = offer.province?.toLowerCase() || "";
      const workDay = offer.workDay?.toLowerCase() || "";

      const matchesTitle = title.includes(searchTitle.toLowerCase());
      const matchesProvince = province.includes(searchLocation.toLowerCase());
      const matchesWorkDay =
        searchWorkDay === "" || workDay === searchWorkDay.toLowerCase();

      return matchesTitle && matchesProvince && matchesWorkDay;
    });

    setFilteredOffers(filtered);
  }, [searchTitle, searchLocation, searchWorkDay, offers]); 


  return (
    <div>
     <div className="filters">
    <input
      type="text"
      placeholder="Buscar por título..."
      value={searchTitle}
      onChange={(e) => setSearchTitle(e.target.value)}
    />
    <input
      type="text"
      placeholder="Buscar por provincia..."
      value={searchLocation}
      onChange={(e) => setSearchLocation(e.target.value)}
    />
    <select
          value={searchWorkDay}
          onChange={(e) => setSearchWorkDay(e.target.value)}
        >
          <option value="">Todas las jornadas</option>
          <option value="Jornada completa">Jornada completa</option>
          <option value="Media jornada">Media jornada</option>
        </select>
  </div>
    <div className="offer-list-container">
   
      {loading ? 
        <p>Cargando</p>
       :     
      
      filteredOffers.length > 0 ? (
        filteredOffers.map((offer) => (
          <Offer
            key={offer.title}
            title={offer.title}
            description={offer.description}
            province={offer.province}
            workDay={offer.workDay}
            country={offer.country}
            dateOffer={offer.dateOffer}
            interestedUsers={offer.interestedUsers}
            offerObj={offer}
          />
        ))
      ) : (
        <p>No se encontraron ofertas laborales.</p>
      )}
    </div>
    </div>
   
  );
};

export default OfferList;
