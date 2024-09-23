## Common issues and resolutions

When running the app with Docker, you may encounter the following errors:

### No Space Left on Device

This error typically occurs in virtual machines.

**Resolution:**
1. Check available space using `df -h`
2. Ensure sufficient space is allocated to the virtual machine

### EOF Error

This error usually indicates internet connectivity issues. Example:
```bash
failed to solve: node:21-alpine3.18: failed to do request: Head "https://registry-1.docker.io/v2/library/node/manifests/21-alpine3.18": EOF
```

**Resolution:** Retry the operation

### `libmamba` Timeout

Example error message:
```
critical libmamba Download error (28) Timeout was reached [https://conda.anaconda.org/conda-forge/linux-aarch64/python-3.11.8-h43d1f9e_0_cpython.conda]
100.7     Operation too slow. Less than 30 bytes/sec transferred the last 60 seconds
```

**Resolution:** Retry the operation

### `Cannot Access runs/...`

**Resolution:** Adjust permissions for the PACMan submodule