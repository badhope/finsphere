# Network Debugging

## Description
Expert in network troubleshooting, HTTP debugging, API testing, DNS resolution, and network connectivity analysis using tools like curl, netcat, tcpdump, and Wireshark.

## Usage Scenario
Use this skill when:
- Debugging network connectivity issues
- Testing API endpoints
- Analyzing HTTP traffic
- DNS troubleshooting
- SSL/TLS certificate issues
- Firewall and proxy debugging

## Instructions

### HTTP Debugging

1. **curl Commands**
   ```bash
   # Basic GET request
   curl https://api.example.com/users
   
   # Verbose output
   curl -v https://api.example.com/users
   
   # Include headers in output
   curl -i https://api.example.com/users
   
   # Only headers
   curl -I https://api.example.com/users
   
   # POST with JSON
   curl -X POST https://api.example.com/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John"}'
   
   # With authentication
   curl -H "Authorization: Bearer token" \
     https://api.example.com/users
   
   # Follow redirects
   curl -L https://example.com
   
   # Save response to file
   curl -o response.json https://api.example.com/data
   
   # Show timing information
   curl -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" \
     -o /dev/null -s https://api.example.com
   ```

2. **HTTPie (User-friendly curl)**
   ```bash
   # GET request
   http GET https://api.example.com/users
   
   # POST with JSON
   http POST https://api.example.com/users name=John email=john@example.com
   
   # With headers
   http GET https://api.example.com/users Authorization:"Bearer token"
   
   # Debug mode
   http --debug GET https://api.example.com/users
   ```

3. **Request Inspection**
   ```bash
   # Trace request path
   curl --trace-ascii - https://api.example.com/users
   
   # Show SSL certificate info
   curl -vI https://api.example.com 2>&1 | awk 'BEGIN { cert=0 } /^* SSL/ { cert=1 } /^*/ { if (cert) print }'
   ```

### DNS Troubleshooting

1. **DNS Lookup**
   ```bash
   # Basic lookup
   nslookup example.com
   
   # Using dig
   dig example.com
   dig @8.8.8.8 example.com  # Specific DNS server
   dig example.com ANY       # All records
   dig example.com MX        # MX records
   
   # Reverse lookup
   dig -x 192.0.2.1
   
   # Trace DNS path
   dig +trace example.com
   ```

2. **DNS Resolution Issues**
   ```bash
   # Check /etc/resolv.conf
   cat /etc/resolv.conf
   
   # Flush DNS cache (macOS)
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   
   # Flush DNS cache (Linux)
   sudo systemd-resolve --flush-caches
   
   # Flush DNS cache (Windows)
   ipconfig /flushdns
   ```

### Connectivity Testing

1. **Port Testing**
   ```bash
   # Using netcat
   nc -zv example.com 443
   
   # Test multiple ports
   nc -zv example.com 80 443 8080
   
   # Using telnet
   telnet example.com 443
   
   # Using timeout
   timeout 5 bash -c 'cat < /dev/null > /dev/tcp/example.com/443' && echo "Open" || echo "Closed"
   ```

2. **Network Path**
   ```bash
   # Traceroute
   traceroute example.com
   
   # With TCP
   traceroute -T example.com
   
   # Using mtr (better)
   mtr example.com
   
   # Check MTU
   ping -M do -s 1472 example.com
   ```

3. **Bandwidth Testing**
   ```bash
   # Using iperf3
   # Server
   iperf3 -s
   
   # Client
   iperf3 -c server.example.com
   
   # With specific bandwidth
   iperf3 -c server.example.com -b 100M
   ```

### SSL/TLS Debugging

1. **Certificate Inspection**
   ```bash
   # Using openssl
   openssl s_client -connect example.com:443 -showcerts
   
   # Get certificate details
   openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -text
   
   # Check certificate expiration
   openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
   
   # Verify certificate chain
   openssl verify -CAfile ca-bundle.crt cert.pem
   ```

2. **SSL/TLS Issues**
   ```bash
   # Check supported protocols
   openssl s_client -connect example.com:443 -tls1_2
   openssl s_client -connect example.com:443 -tls1_3
   
   # Check cipher suites
   nmap --script ssl-enum-ciphers -p 443 example.com
   
   # Test with specific cipher
   openssl s_client -connect example.com:443 -cipher 'AES256-SHA'
   ```

### Packet Capture

1. **tcpdump**
   ```bash
   # Capture all traffic on interface
   sudo tcpdump -i eth0
   
   # Filter by host
   sudo tcpdump -i eth0 host 192.168.1.1
   
   # Filter by port
   sudo tcpdump -i eth0 port 443
   
   # Capture HTTP traffic
   sudo tcpdump -i eth0 -A -s 0 'tcp port 80'
   
   # Save to file
   sudo tcpdump -i eth0 -w capture.pcap
   
   # Read from file
   tcpdump -r capture.pcap
   ```

2. **Wireshark Filters**
   ```
   # HTTP traffic
   http
   
   # Specific host
   ip.addr == 192.168.1.1
   
   # TCP SYN packets
   tcp.flags.syn == 1
   
   # DNS queries
   dns
   
   # SSL handshake
   ssl.handshake
   ```

### Proxy Debugging

1. **Proxy Testing**
   ```bash
   # Via HTTP proxy
   curl -x http://proxy:8080 https://api.example.com
   
   # Via SOCKS proxy
   curl --socks5 proxy:1080 https://api.example.com
   
   # With proxy authentication
   curl -x http://user:pass@proxy:8080 https://api.example.com
   ```

2. **Environment Variables**
   ```bash
   export HTTP_PROXY=http://proxy:8080
   export HTTPS_PROXY=http://proxy:8080
   export NO_PROXY=localhost,127.0.0.1
   ```

### WebSockets

1. **WebSocket Testing**
   ```bash
   # Using wscat
   wscat -c wss://example.com/ws
   
   # With headers
   wscat -c wss://example.com/ws -H "Authorization: Bearer token"
   
   # Using curl (limited)
   curl --include \
     --no-buffer \
     --header "Connection: Upgrade" \
     --header "Upgrade: websocket" \
     --header "Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==" \
     --header "Sec-WebSocket-Version: 13" \
     https://example.com/ws
   ```

### Network Performance

1. **Latency Testing**
   ```bash
   # Ping with timestamp
   ping -D example.com
   
   # Continuous ping with stats
   ping -i 0.2 example.com
   
   # TCP ping
   tcpping example.com 443
   ```

2. **Connection Issues**
   ```bash
   # Check connections
   netstat -an | grep :443
   
   # Using ss (faster)
   ss -tulpn | grep :443
   
   # Check connection states
   ss -s
   
   # Check TIME_WAIT connections
   ss -tan | grep TIME_WAIT | wc -l
   ```

## Output Contract
- Network diagnostic commands
- Connectivity test results
- SSL/TLS analysis
- Packet capture analysis
- Troubleshooting steps

## Constraints
- Respect privacy and security
- Don't capture sensitive data
- Use appropriate permissions
- Document findings
- Consider production impact

## Examples

### Example 1: API Debugging Session
```bash
# Test basic connectivity
$ curl -I https://api.example.com/health
HTTP/2 200
content-type: application/json

# Test with timing
$ curl -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" -o /dev/null -s https://api.example.com
DNS: 0.015s
Connect: 0.045s
TTFB: 0.120s
Total: 0.125s

# Debug slow response
$ curl -v https://api.example.com/slow-endpoint
* Connected to api.example.com (1.2.3.4) port 443
> GET /slow-endpoint HTTP/2
< HTTP/2 200
< x-response-time: 5000ms
```

### Example 2: SSL Certificate Debug
```bash
# Check certificate chain
$ openssl s_client -connect api.example.com:443 -showcerts
CONNECTED(00000003)
depth=2 C = US, O = DigiCert Inc, OU = www.digicert.com, CN = DigiCert Global Root CA
verify return:1
depth=1 C = US, O = DigiCert Inc, CN = DigiCert SHA2 Secure Server CA
verify return:1
depth=0 CN = api.example.com
verify return:1

# Check expiration
$ echo | openssl s_client -connect api.example.com:443 2>/dev/null | openssl x509 -noout -dates
notBefore=Mar  1 00:00:00 2024 GMT
notAfter=Mar  1 23:59:59 2025 GMT
```
