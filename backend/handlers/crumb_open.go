package handlers

import (
	"backend/helpers"
	"backend/models"
	"backend/utils"
	"context"
	"strings"

	"github.com/aws/aws-lambda-go/events"
)

func handleOpenCrumb(ctx context.Context, req events.APIGatewayV2HTTPRequest) (events.APIGatewayV2HTTPResponse, error) {
	crumbId := strings.TrimSpace(req.PathParameters["id"])

	if crumbId == "" {
		return models.InvalidRequestErrorResponse("No crumb id provided!"), nil
	}

	crumb, err := helpers.NewCrumbHelper(ctx).GetCrumbContent(crumbId)
	if err != nil {
		return models.ServerSideErrorResponse("Failed to open crumb, try again!", err), nil
	}

	validLocation, err := helpers.NewLocationHelper(ctx).UsersCurrentLocationIsValid(
		utils.Coordinate{Latitude: crumb.Latitude, Longitude: crumb.Longitude},
	)

	if err != nil {
		return models.ServerSideErrorResponse("Failed to determine your location!", err), nil
	}

	if !validLocation {
		return models.ForbiddenErrorResponse("Unable to determine your location"), nil
	}

	return models.SuccessfulGetRequestResponse(crumb.Content, nil), nil
}
