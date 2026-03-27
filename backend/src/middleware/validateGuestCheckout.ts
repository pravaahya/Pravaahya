import { Request, Response, NextFunction } from 'express';

export const validateGuestCheckout = (req: Request, res: Response, next: NextFunction): void => {
  const { user } = req.body;
  
  if (!user || (!user.address && typeof user.address !== 'object')) {
    res.status(400).json({ error: "Structured Address payload structurally missing." });
    return;
  }

  const { houseNo, streetArea, landmark, cityVillage, district, state, country, pincode } = user.address;

  if (typeof houseNo !== 'string' || houseNo.trim().length < 1) {
    res.status(400).json({ error: "houseNo -> required, min 1 char" }); return;
  }
  if (typeof streetArea !== 'string' || streetArea.trim().length < 3) {
    res.status(400).json({ error: "streetArea -> required, min 3 chars" }); return;
  }
  if (landmark && typeof landmark === 'string' && landmark.trim().length > 100) {
    res.status(400).json({ error: "landmark -> max 100 chars" }); return;
  }
  if (typeof cityVillage !== 'string' || !/^[a-zA-Z\s]+$/.test(cityVillage.trim())) {
    res.status(400).json({ error: "cityVillage -> required, letters only" }); return;
  }
  if (typeof district !== 'string' || !district.trim()) {
    res.status(400).json({ error: "district -> required" }); return;
  }
  if (typeof state !== 'string' || !state.trim()) {
    res.status(400).json({ error: "state -> required" }); return;
  }
  if (typeof country !== 'string' || !country.trim()) {
    res.status(400).json({ error: "country -> required" }); return;
  }
  if (typeof pincode !== 'string' || !/^\d{5,10}$/.test(pincode.trim())) {
    res.status(400).json({ error: "pincode -> required, 5-10 digits (numeric only)" }); return;
  }

  // Rebind normalized & trimmed vectors natively onto request object safely
  req.body.user.address = {
    houseNo: houseNo.trim(),
    streetArea: streetArea.trim(),
    landmark: landmark ? landmark.trim() : "",
    cityVillage: cityVillage.trim(),
    district: district.trim(),
    state: state.trim(),
    country: country.trim(),
    pincode: pincode.trim(),
  };

  next();
};
