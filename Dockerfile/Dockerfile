# ========================
# FRONTEND BUILD (React)
# ========================
FROM node:20-bookworm-slim AS frontend-build

WORKDIR /app/ClientApp

# Install dependencies separately for caching
COPY ClientApp/package*.json ./
RUN npm install --legacy-peer-deps

# Copy rest of React source
COPY ClientApp/ ./
RUN npm run build

# ========================
# BACKEND BUILD (.NET 9)
# ========================
FROM mcr.microsoft.com/dotnet/sdk:9.0-bookworm-slim-arm64v8 AS build

WORKDIR /src
# Install Node.js inside the .NET SDK container
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*
COPY ["BudgetApp.csproj", "./"]
RUN dotnet restore

# Copy rest of backend
COPY . .
RUN dotnet publish -c Release -o /app/publish

# ========================
# FINAL IMAGE
# ========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0-bookworm-slim-arm64v8 AS final

WORKDIR /app

# Copy backend publish
COPY --from=build /app/publish .

# Copy React build to wwwroot
COPY --from=frontend-build /app/ClientApp/build ./wwwroot

EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "BudgetApp.dll"]
