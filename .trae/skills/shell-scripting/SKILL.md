# Shell Scripting

## Description
Expert in shell script generation, debugging, and automation task execution. Supports Bash, Zsh, PowerShell, and cross-platform scripting.

## Usage Scenario
Use this skill when:
- Writing automation scripts
- Creating deployment scripts
- System administration tasks
- Batch file processing
- CI/CD script generation
- Cross-platform scripting needs

## Instructions

### Script Structure
1. **Shebang and Headers**
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   IFS=$'\n\t'
   ```

2. **Script Metadata**
   ```bash
   # Script: script-name.sh
   # Description: What this script does
   # Author: Name
   # Version: 1.0.0
   # Usage: ./script-name.sh [options] <args>
   ```

### Best Practices
1. **Error Handling**
   - Use `set -e` to exit on error
   - Use `set -u` to fail on undefined variables
   - Use `set -o pipefail` to catch pipe errors
   - Implement trap for cleanup

2. **Logging**
   ```bash
   log_info() { echo "[INFO] $*"; }
   log_warn() { echo "[WARN] $*" >&2; }
   log_error() { echo "[ERROR] $*" >&2; }
   ```

3. **Input Validation**
   - Check required arguments
   - Validate file/directory existence
   - Verify permissions

### Common Patterns

1. **Argument Parsing**
   ```bash
   while [[ $# -gt 0 ]]; do
       case $1 in
           -h|--help) show_help; exit 0 ;;
           -v|--verbose) VERBOSE=1; shift ;;
           *) POSITIONAL_ARGS+=("$1"); shift ;;
       esac
   done
   ```

2. **File Operations**
   ```bash
   # Safe file reading
   while IFS= read -r line; do
       process_line "$line"
   done < "$file"
   
   # Find and process
   find . -type f -name "*.txt" -exec process {} \;
   ```

3. **Directory Operations**
   ```bash
   # Create with parents
   mkdir -p "$TARGET_DIR"
   
   # Safe cd with trap
   SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
   ```

4. **Command Execution**
   ```bash
   # Check command exists
   command -v jq >/dev/null 2>&1 || { echo "jq required"; exit 1; }
   
   # Capture output
   result=$(some_command 2>&1) || { log_error "$result"; exit 1; }
   ```

### Cross-Platform Considerations
1. **Bash vs Zsh**
   - Use POSIX-compatible syntax when possible
   - Avoid Zsh-specific features for portability

2. **PowerShell Equivalent**
   - Provide PowerShell alternatives for Windows
   - Use cross-platform tools (jq, yq, etc.)

### Script Templates

1. **Deployment Script**
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   
   ENV="${1:-staging}"
   VERSION="${2:-latest}"
   
   log_info "Deploying version $VERSION to $ENV"
   # Deployment logic here
   ```

2. **Backup Script**
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   
   SOURCE="$1"
   BACKUP_DIR="${BACKUP_DIR:-/backup}"
   TIMESTAMP=$(date +%Y%m%d_%H%M%S)
   
   tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" "$SOURCE"
   ```

3. **Cleanup Script**
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   
   # Remove files older than 30 days
   find /tmp -type f -mtime +30 -delete
   # Remove empty directories
   find /tmp -type d -empty -delete
   ```

## Output Contract
- Complete, executable scripts
- Proper error handling
- Clear usage documentation
- Cross-platform compatibility notes
- Security considerations

## Constraints
- Never hardcode secrets
- Use environment variables for sensitive data
- Validate all inputs
- Provide dry-run options for destructive operations
- Include proper exit codes

## Examples

### Example 1: Service Monitor Script
```bash
#!/usr/bin/env bash
set -euo pipefail

SERVICE="$1"
MAX_RETRIES=3
RETRY_INTERVAL=5

check_service() {
    systemctl is-active --quiet "$SERVICE"
}

for i in $(seq 1 $MAX_RETRIES); do
    if check_service; then
        echo "Service $SERVICE is running"
        exit 0
    fi
    echo "Attempt $i failed, retrying in ${RETRY_INTERVAL}s..."
    sleep $RETRY_INTERVAL
done

echo "Service $SERVICE is not running after $MAX_RETRIES attempts"
exit 1
```

### Example 2: Log Rotation
```bash
#!/usr/bin/env bash
set -euo pipefail

LOG_DIR="/var/log/app"
MAX_FILES=7
MAX_SIZE="100M"

# Rotate logs by size
find "$LOG_DIR" -name "*.log" -size +$MAX_SIZE -exec sh -c '
    for log; do
        mv "$log" "$log.$(date +%Y%m%d%H%M%S)"
        gzip "$log.$(date +%Y%m%d%H%M%S)"
    done
' sh {} +

# Remove old files
find "$LOG_DIR" -name "*.gz" -mtime +$MAX_FILES -delete
```
