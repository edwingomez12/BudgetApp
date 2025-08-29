# ========= FRONTEND BUILD =========
FROM node:20-alpine AS frontend-build
WORKDIR /app

# Copy React app
COPY ../ClientApp/package*.json ./ClientApp/
WORKDIR /app/ClientApp
RUN npm install

COPY ../ClientApp/ ./ 
RUN npm run build

# ========= BACKEND BUILD =========
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
# Install Node.js inside the .NET SDK container
RUN apt-get update && apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*
# Copy solution and project file(s)
COPY ../BudgetApp.sln ./
COPY ../BudgetApp.csproj ./

RUN dotnet restore

# Copy everything and publish
COPY ../ ./
WORKDIR /src
RUN dotnet publish -c Release -o /app/publish

# ========= FINAL IMAGE =========
FROM mcr.microsoft.com/dotnet/aspnet:9.0-bookworm-slim-arm64v8 AS final
WORKDIR /app

# Copy backend
COPY --from=build /app/publish .

# Copy React build into wwwroot
COPY --from=frontend-build /app/ClientApp/build ./wwwroot

EXPOSE 80
ENV ASPNETCORE_URLS=http://+:80
ENTRYPOINT ["dotnet", "BudgetApp.dll"]
