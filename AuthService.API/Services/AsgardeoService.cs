using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using AuthService.API.DTOs;

namespace AuthService.API.Services;

public class AsgardeoService : IAsgardeoService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly string _userInfoEndpoint;
    private readonly string _introspectEndpoint;
    private readonly string _clientId;
    private readonly string _clientSecret;

    public AsgardeoService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _userInfoEndpoint = _configuration["Asgardeo:UserInfoEndpoint"]
            ?? throw new InvalidOperationException("Asgardeo UserInfoEndpoint not configured");
        _introspectEndpoint = _configuration["Asgardeo:IntrospectEndpoint"]
            ?? throw new InvalidOperationException("Asgardeo IntrospectEndpoint not configured");
        _clientId = _configuration["Asgardeo:ClientId"]
            ?? throw new InvalidOperationException("Asgardeo ClientId not configured");
        _clientSecret = _configuration["Asgardeo:ClientSecret"]
            ?? throw new InvalidOperationException("Asgardeo ClientSecret not configured");
    }

    public async Task<AsgardeoUserInfo?> GetUserInfoAsync(string accessToken)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, _userInfoEndpoint);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var content = await response.Content.ReadAsStringAsync();
            var userInfo = JsonSerializer.Deserialize<AsgardeoUserInfo>(content, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return userInfo;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error getting user info from Asgardeo: {ex.Message}");
            return null;
        }
    }

    public async Task<bool> ValidateTokenAsync(string accessToken)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Post, _introspectEndpoint);

            // Add Basic Authentication for client credentials
            var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", credentials);

            // Add form data
            var formData = new Dictionary<string, string>
            {
                { "token", accessToken }
            };
            request.Content = new FormUrlEncodedContent(formData);

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                return false;
            }

            var content = await response.Content.ReadAsStringAsync();
            var introspectResponse = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(content);

            if (introspectResponse != null && introspectResponse.TryGetValue("active", out var activeValue))
            {
                return activeValue.GetBoolean();
            }

            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error validating token with Asgardeo: {ex.Message}");
            return false;
        }
    }
}
