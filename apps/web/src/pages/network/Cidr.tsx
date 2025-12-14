import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Address4, Address6 } from 'ip-address';
import {
  Container,
  Title,
  Text,
  Grid,
  Paper,
  Textarea,
  Group,
  Stack,
  Divider,
  Alert,
} from '@mantine/core';
import { AlertCircle } from 'lucide-react';

interface NetworkInfo {
  type: 'CIDR' | 'Range';
  version: 'IPv4' | 'IPv6';
  address: string;
  netmask?: string;
  wildcard?: string;
  network?: string;
  broadcast?: string;
  hostMin?: string;
  hostMax?: string;
  totalHosts?: string;
  cidrMask?: number;
}

const calculateWildcard = (netmask: string): string => {
  try {
    const parts = netmask.split('.');
    if (parts.length !== 4) return '';
    return parts.map((part) => 255 - parseInt(part, 10)).join('.');
  } catch {
    return '';
  }
};

const prefixToMask = (prefix: number): string => {
  const mask = [];
  for (let i = 0; i < 4; i++) {
    const n = Math.min(prefix, 8);
    mask.push(256 - Math.pow(2, 8 - n));
    prefix -= n;
    if (prefix < 0) prefix = 0;
  }
  return mask.join('.');
};

const CidrCalculator: React.FC = () => {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  const { result, error } = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { result: null, error: null };
    }

    try {
      // Check for Range format (with '-')
      if (trimmed.includes('-')) {
        const parts = trimmed.split('-').map((p) => p.trim());
        if (parts.length === 2) {
          const [startStr, endStr] = parts;

          let version: 'IPv4' | 'IPv6' | null = null;
          let valid = false;

          if (Address4.isValid(startStr) && Address4.isValid(endStr)) {
            version = 'IPv4';
            valid = true;
          } else if (Address6.isValid(startStr) && Address6.isValid(endStr)) {
            version = 'IPv6';
            valid = true;
          }

          if (valid && version) {
            let totalHosts = '0';
            let netmask: string | undefined;
            let wildcard: string | undefined;
            let network: string | undefined;
            let broadcast: string | undefined;
            let cidrMask: number | undefined;

            if (version === 'IPv4') {
              const startAddr = new Address4(startStr);
              const endAddr = new Address4(endStr);

              // Use built-in BigInteger if available or manual calculation for IPv4 (safe in Number)
              // Accessing internal binary or parts
              const startBig = BigInt('0x' + startAddr.toHex().replace(/:/g, ''));
              const endBig = BigInt('0x' + endAddr.toHex().replace(/:/g, ''));

              if (endBig >= startBig) {
                const diff = endBig - startBig + 1n;
                totalHosts = diff.toString();

                // Try to detect if it's a valid CIDR
                // 1. diff must be power of 2
                // 2. startBig % diff === 0
                if ((diff & (diff - 1n)) === 0n) {
                  // It is a power of 2
                  // Calculate mask bits
                  // 32 - log2(diff)
                  let tempDiff = diff;
                  let power = 0;
                  while (tempDiff > 1n) {
                    tempDiff >>= 1n;
                    power++;
                  }
                  const detectedCidr = 32 - power;

                  // Check alignment
                  const blockSize = 1n << BigInt(power);
                  if (startBig % blockSize === 0n) {
                    // Valid CIDR detected!
                    cidrMask = detectedCidr;

                    // Re-construct as CIDR
                    const cidrStr = `${startStr}/${detectedCidr}`;
                    const cidrObj = new Address4(cidrStr);

                    netmask = prefixToMask(detectedCidr);
                    wildcard = calculateWildcard(netmask);
                    network = `${cidrObj.startAddress().correctForm()}/${detectedCidr}`;
                    broadcast = cidrObj.endAddress().correctForm();
                  }
                }
              }
            } else {
              // IPv6 calculation
              const startAddr = new Address6(startStr);
              const endAddr = new Address6(endStr);
              // Parsing hex for BigInt
              // Address6.toHex() returns colon separated groups
              const startBytes = startAddr.toUnsignedByteArray();
              const endBytes = endAddr.toUnsignedByteArray();

              // Manual hex construction from bytes to avoid property access issues
              const startHex = Array.from(startBytes)
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');
              const endHex = Array.from(endBytes)
                .map((b) => b.toString(16).padStart(2, '0'))
                .join('');

              const startBig = BigInt('0x' + startHex);
              const endBig = BigInt('0x' + endHex);

              if (endBig >= startBig) {
                const diff = endBig - startBig + 1n;
                totalHosts = diff.toString();
              }
            }

            return {
              result: {
                type: 'Range',
                version,
                address: `${startStr} - ${endStr}`,
                hostMin: startStr,
                hostMax: endStr,
                totalHosts: Number(totalHosts).toLocaleString(),
                netmask,
                wildcard,
                network,
                broadcast,
                cidrMask,
              } as NetworkInfo,
              error: null,
            };
          }
        }
      }

      // Check for CIDR or single IP
      if (Address4.isValid(trimmed)) {
        const addr = new Address4(trimmed);
        const cidrMask = parseInt(addr.subnet.split('/')[1] || '32', 10);
        const subnetMask = prefixToMask(cidrMask);

        // Calculate Wildcard
        const wildcard = calculateWildcard(subnetMask);

        // Hosts Calculation
        let hostsCount = 0;
        if (cidrMask === 32) hostsCount = 1;
        else if (cidrMask === 31)
          hostsCount = 2; // Point-to-point usually
        else hostsCount = Math.pow(2, 32 - cidrMask) - 2;

        const totalHosts = hostsCount <= 0 ? '0' : hostsCount.toLocaleString();

        const startAddrRaw = addr.startAddress().correctForm();
        const endAddrRaw = addr.endAddress().correctForm();

        let hostMin = startAddrRaw;
        let hostMax = endAddrRaw;

        if (cidrMask < 31) {
          const startParts = startAddrRaw.split('.').map(Number);
          startParts[3]++;
          hostMin = startParts.join('.');

          const endParts = endAddrRaw.split('.').map(Number);
          endParts[3]--;
          hostMax = endParts.join('.');
        }

        return {
          result: {
            type: 'CIDR',
            version: 'IPv4',
            address: trimmed.split('/')[0],
            netmask: subnetMask,
            wildcard: wildcard,
            network: `${addr.startAddress().correctForm()}/${cidrMask}`,
            broadcast: addr.endAddress().correctForm(),
            hostMin: hostMin,
            hostMax: hostMax,
            totalHosts: totalHosts,
            cidrMask: cidrMask,
          } as NetworkInfo,
          error: null,
        };
      }

      if (Address6.isValid(trimmed)) {
        const addr = new Address6(trimmed);
        const cidrMask = parseInt(addr.subnet.split('/')[1] || '128', 10);

        return {
          result: {
            type: 'CIDR',
            version: 'IPv6',
            address: trimmed.split('/')[0],
            hostMin: addr.startAddress().correctForm(),
            hostMax: addr.endAddress().correctForm(),
            network: `${addr.startAddress().correctForm()}/${cidrMask}`,
            totalHosts: 'Huge',
            cidrMask: cidrMask,
          } as NetworkInfo,
          error: null,
        };
      }

      return { result: null, error: 'cidr.errorInvalid' };
    } catch (e) {
      console.error(e);
      return { result: null, error: 'cidr.errorInvalid' };
    }
  }, [input]);

  const InfoRow = ({
    label,
    value,
    mono = false,
  }: {
    label: string;
    value: React.ReactNode;
    mono?: boolean;
  }) => (
    <Group justify="space-between" align="flex-start" wrap="nowrap">
      <Text c="dimmed" size="sm" style={{ width: 100, flexShrink: 0 }}>
        {label}:
      </Text>
      <Text
        size="sm"
        fw={500}
        c="blue"
        style={{
          fontFamily: mono ? 'monospace' : undefined,
          wordBreak: 'break-all',
        }}
      >
        {value}
      </Text>
    </Group>
  );

  return (
    <Container size="xl" py="lg">
      <Title order={2} size="h1" fw={900} mb="lg">
        {t('cidr.title')}
      </Title>

      <Grid gutter="xl">
        {/* Input Section */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md" h="100%">
            <Text component="h3" size="lg" fw={600} mb="xs">
              {t('cidr.inputLabel')}
            </Text>
            <Text size="sm" c="dimmed" mb="md">
              {t('cidr.placeholder')}
            </Text>

            <Textarea
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="192.168.1.0/24 or 192.168.1.1-192.168.1.254"
              minRows={6}
              styles={{ input: { fontFamily: 'monospace' } }}
              mb="md"
            />

            {error && (
              <Alert icon={<AlertCircle size={16} />} title="Error" color="red">
                {t(error)}
              </Alert>
            )}
          </Paper>
        </Grid.Col>

        {/* Output Section */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder p="md" radius="md" h="100%">
            <Text component="h3" size="lg" fw={600} mb="md">
              {t('cidr.outputLabel')}
            </Text>

            {!result ? (
              <Stack
                align="center"
                justify="center"
                h={200}
                style={{
                  border: '2px dashed var(--mantine-color-gray-3)',
                  borderRadius: '8px',
                }}
              >
                <Text c="dimmed">{t('cidr.placeholder')}</Text>
              </Stack>
            ) : (
              <Stack gap="sm">
                <InfoRow label={t('cidr.address')} value={result.address} mono />

                {result.netmask && (
                  <InfoRow
                    label={t('cidr.netmask')}
                    value={`${result.netmask} ${result.cidrMask ? `= ${result.cidrMask}` : ''}`}
                    mono
                  />
                )}

                {result.wildcard && (
                  <InfoRow label={t('cidr.wildcard')} value={result.wildcard} mono />
                )}

                <Divider my="xs" />

                {result.network && (
                  <InfoRow label={t('cidr.network')} value={result.network} mono />
                )}

                {result.broadcast && (
                  <InfoRow label={t('cidr.broadcast')} value={result.broadcast} mono />
                )}

                {result.hostMin && (
                  <InfoRow label={t('cidr.hostMin')} value={result.hostMin} mono />
                )}

                {result.hostMax && (
                  <InfoRow label={t('cidr.hostMax')} value={result.hostMax} mono />
                )}

                {result.totalHosts && (
                  <InfoRow label={t('cidr.hostsNet')} value={result.totalHosts} />
                )}

                <InfoRow label={t('cidr.type')} value={`${result.version} ${result.type}`} />
              </Stack>
            )}
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CidrCalculator;
