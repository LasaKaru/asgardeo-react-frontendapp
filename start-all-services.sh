#!/bin/bash

# Real Estate Management System - Start All Microservices
# This script starts all 7 microservices in separate terminal windows

echo "========================================="
echo "Real Estate Microservices Startup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if all service directories exist
SERVICES=(
    "APIGateway:8080"
    "AuthService.API:5000"
    "PropertyService.API:5001"
    "OwnerService.API:5002"
    "TenantService.API:5003"
    "LeaseService.API:5004"
    "PaymentService.API:5005"
    "MaintenanceService.API:5006"
)

echo -e "${BLUE}Checking service directories...${NC}"
ALL_EXISTS=true
for SERVICE_PORT in "${SERVICES[@]}"; do
    SERVICE="${SERVICE_PORT%:*}"
    if [ ! -d "$SERVICE" ]; then
        echo -e "${YELLOW}Warning: $SERVICE directory not found${NC}"
        ALL_EXISTS=false
    else
        echo -e "${GREEN}✓${NC} $SERVICE found"
    fi
done

if [ "$ALL_EXISTS" = false ]; then
    echo -e "${YELLOW}Some services are missing. Continuing with available services...${NC}"
fi

echo ""
echo -e "${BLUE}Starting microservices...${NC}"
echo ""

# Function to start a service in a new terminal
start_service() {
    local SERVICE_NAME=$1
    local PORT=$2
    local SERVICE_DIR=$3

    if [ -d "$SERVICE_DIR" ]; then
        echo -e "${GREEN}Starting $SERVICE_NAME on port $PORT...${NC}"

        # Try to use gnome-terminal, xterm, or konsole
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal -- bash -c "cd $SERVICE_DIR && echo 'Starting $SERVICE_NAME...' && dotnet run; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -hold -e "cd $SERVICE_DIR && echo 'Starting $SERVICE_NAME...' && dotnet run" &
        elif command -v konsole &> /dev/null; then
            konsole --hold -e "cd $SERVICE_DIR && echo 'Starting $SERVICE_NAME...' && dotnet run" &
        else
            echo -e "${YELLOW}No suitable terminal found. Running in background...${NC}"
            (cd "$SERVICE_DIR" && dotnet run > "$SERVICE_NAME.log" 2>&1 &)
            echo "  Logs: $SERVICE_NAME.log"
        fi

        sleep 1
    else
        echo -e "${YELLOW}Skipping $SERVICE_NAME (directory not found)${NC}"
    fi
}

# Start all services (API Gateway first, then microservices)
start_service "API Gateway" "8080" "APIGateway"
sleep 2  # Give gateway time to start
start_service "Auth Service" "5000" "AuthService.API"
start_service "Property Service" "5001" "PropertyService.API"
start_service "Owner Service" "5002" "OwnerService.API"
start_service "Tenant Service" "5003" "TenantService.API"
start_service "Lease Service" "5004" "LeaseService.API"
start_service "Payment Service" "5005" "PaymentService.API"
start_service "Maintenance Service" "5006" "MaintenanceService.API"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}All services are starting!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}API Gateway (Main Entry Point):${NC}"
echo "  Gateway URL:         http://localhost:8080"
echo "  Gateway Swagger:     http://localhost:8080/swagger"
echo "  Gateway Info:        http://localhost:8080/gateway-info"
echo "  Services Status:     http://localhost:8080/api/gateway/services-status"
echo ""
echo -e "${BLUE}Microservices (Backend):${NC}"
echo "  Auth Service:        http://localhost:5000"
echo "  Property Service:    http://localhost:5001"
echo "  Owner Service:       http://localhost:5002"
echo "  Tenant Service:      http://localhost:5003"
echo "  Lease Service:       http://localhost:5004"
echo "  Payment Service:     http://localhost:5005"
echo "  Maintenance Service: http://localhost:5006"
echo ""
echo -e "${BLUE}Swagger Documentation:${NC}"
echo "  Gateway Swagger:     http://localhost:8080/swagger"
echo "  Auth Swagger:        http://localhost:5000/swagger"
echo "  http://localhost:5001/swagger"
echo "  http://localhost:5002/swagger"
echo "  http://localhost:5003/swagger"
echo "  http://localhost:5004/swagger"
echo "  http://localhost:5005/swagger"
echo "  http://localhost:5006/swagger"
echo ""
echo -e "${YELLOW}Note: Services may take a few seconds to start${NC}"
echo -e "${YELLOW}Press Ctrl+C in each terminal window to stop a service${NC}"
echo ""

# Wait a bit for services to start
echo -e "${BLUE}Waiting for services to initialize...${NC}"
sleep 5

# Check if services are running
echo ""
echo -e "${BLUE}Checking service health...${NC}"
for SERVICE_PORT in "${SERVICES[@]}"; do
    IFS=':' read -ra PARTS <<< "$SERVICE_PORT"
    SERVICE="${PARTS[0]}"
    PORT="${PARTS[1]}"

    if curl -s "http://localhost:$PORT/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} ${SERVICE} is running on port $PORT"
    else
        echo -e "${YELLOW}⚠${NC} ${SERVICE} not responding yet on port $PORT (may still be starting)"
    fi
done

echo ""
echo -e "${GREEN}Startup complete!${NC}"
echo ""
echo "To start the frontend:"
echo "  npm start"
echo ""
