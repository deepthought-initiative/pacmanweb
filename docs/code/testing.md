# Test execution instructions
Tests also follow the same environment file on your machine and run 
The data folder contains sample proposal files and panelist files for testing purposes and copies over the model files from the PACMan folder(assumes PACMan has model files in its models folder).

To run tests do-
```bash
docker compose -f docker-compose-test.yml build
docker compose -f docker-compose-test.yml run --rm
```
