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

  useEffect(() => {
    const unsubscribe = findOfferByUserUid(user ? user.uid : null, (data) => {
      setOffers(data);
      setFilteredOffers(data);
    });
    return () => {
      unsubscribe();
    };
  }, [user]);

  // Manejar el filtrado de ofertas
  useEffect(() => {
    const filtered = offers.filter(
      (offer) =>
        offer.title.toLowerCase().includes(searchTitle.toLowerCase()) &&
        offer.province.toLowerCase().includes(searchLocation.toLowerCase())
    );
    setFilteredOffers(filtered);
  }, [searchTitle, searchLocation, offers]);

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
      placeholder="Buscar por localidad..."
      value={searchLocation}
      onChange={(e) => setSearchLocation(e.target.value)}
    />
  </div>
    <div className="offer-list-container">
   
      {filteredOffers.length > 0 ? (
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
