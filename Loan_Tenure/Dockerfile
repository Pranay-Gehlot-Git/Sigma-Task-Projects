FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 5276

ENV ASPNETCORE_URLS=http://+:5276

# Creates a non-root user with an explicit UID and adds permission to access the /app folder
# For more info, please refer to https://aka.ms/vscode-docker-dotnet-configure-containers
RUN adduser -u 5678 --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Loan_Tenure.csproj", "./"]
RUN dotnet restore "Loan_Tenure.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "Loan_Tenure.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Loan_Tenure.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
USER pranayg
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Loan_Tenure.dll"]
