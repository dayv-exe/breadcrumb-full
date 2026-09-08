package utils

import (
	"backend/constants"
	"fmt"
	"math"
	"time"
)

type Coordinate struct {
	Latitude  float64
	Longitude float64
}

func IsWithinRadius(centerLat, centerLon, lat, lon, radiusMeters float64) bool {
	return haversineMeters(centerLat, centerLon, lat, lon) <= radiusMeters
}

func haversineMeters(lat1, lon1, lat2, lon2 float64) float64 {
	phi1 := lat1 * math.Pi / 180
	phi2 := lat2 * math.Pi / 180
	dPhi := (lat2 - lat1) * math.Pi / 180
	dLambda := (lon2 - lon1) * math.Pi / 180

	a := math.Sin(dPhi/2)*math.Sin(dPhi/2) +
		math.Cos(phi1)*math.Cos(phi2)*
			math.Sin(dLambda/2)*math.Sin(dLambda/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	return constants.EARTH_RADIUS * c
}

// TravelSpeed holds the computed result.
type TravelSpeed struct {
	DistanceMeters  float64
	Elapsed         time.Duration
	MetersPerSecond float64
	KilometersPerHr float64
	MilesPerHr      float64
}

// RequiredSpeed calculates how fast a user must have traveled to move
// from lastKnown to current in the elapsed time between the two timestamps.
func RequiredSpeed(
	lastKnown, current Coordinate,
	lastKnownTime, newestTime string,
) (TravelSpeed, error) {

	lastT, err := time.Parse(time.RFC3339Nano, lastKnownTime)
	if err != nil {
		return TravelSpeed{}, fmt.Errorf("parsing lastKnown timestamp %q: %w", lastKnownTime, err)
	}

	currentT, err := time.Parse(time.RFC3339Nano, newestTime)
	if err != nil {
		return TravelSpeed{}, fmt.Errorf("parsing newest timestamp %q: %w", newestTime, err)
	}

	elapsed := currentT.Sub(lastT)
	if elapsed <= 0 {
		return TravelSpeed{}, fmt.Errorf(
			"current timestamp (%v) must be after lastKnown timestamp (%v)",
			newestTime, lastKnownTime,
		)
	}

	dist := haversineMeters(
		lastKnown.Latitude, lastKnown.Longitude,
		current.Latitude, current.Longitude,
	)
	mps := dist / elapsed.Seconds()

	return TravelSpeed{
		DistanceMeters:  dist,
		Elapsed:         elapsed,
		MetersPerSecond: mps,
		KilometersPerHr: mps * 3.6,
		MilesPerHr:      mps * 2.2369362920544,
	}, nil
}
