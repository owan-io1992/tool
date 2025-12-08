import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Address4, Address6 } from 'ip-address';

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
        // Use BigInteger for safe calculation although IPv4 fits in number, good practice
        // For IPv4: 2^(32-mask) - 2 (except /31 and /32)
        let hostsCount = 0;
        if (cidrMask === 32) hostsCount = 1;
        else if (cidrMask === 31)
          hostsCount = 2; // Point-to-point usually
        else hostsCount = Math.pow(2, 32 - cidrMask) - 2;

        const totalHosts = hostsCount <= 0 ? '0' : hostsCount.toLocaleString();

        // HostMin/Max
        // startAddress is usually network address, +1 for hostMin (if not /31, /32)
        // endAddress is usually broadcast, -1 for hostMax

        // We need to parse start/end manually to adjust for Min/Max
        const startAddrRaw = addr.startAddress().correctForm();
        const endAddrRaw = addr.endAddress().correctForm();

        let hostMin = startAddrRaw;
        let hostMax = endAddrRaw;

        if (cidrMask < 31) {
          // Simple increment/decrement logic for IPv4 string
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
            address: trimmed.split('/')[0], // User input IP
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

  return (
    <div className="mx-auto max-w-7xl p-6">
      <h2 className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
        {t('cidr.title')}
      </h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Input Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            {t('cidr.inputLabel')}
          </h3>

          <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            {t('cidr.placeholder')}
          </div>

          <div className="mb-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-32 w-full resize-none rounded-lg border border-gray-300 bg-gray-50 p-2.5 font-mono text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/30 dark:text-red-300">
              {t(error)}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white">
            {t('cidr.outputLabel')}
          </h3>

          {!result ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-gray-300 p-8 text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {t('cidr.placeholder')}
            </div>
          ) : (
            <div className="space-y-4 font-mono text-sm text-gray-900 dark:text-gray-200">
              <div className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1">
                {/* Address */}
                <div className="text-gray-500 dark:text-gray-400">{t('cidr.address')}:</div>
                <div className="font-bold break-all text-blue-600 dark:text-blue-400">
                  {result.address}
                </div>

                {/* Netmask */}
                {result.netmask && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">{t('cidr.netmask')}:</div>
                    <div className="break-all">
                      {result.netmask} {result.cidrMask ? `= ${result.cidrMask}` : ''}
                    </div>
                  </>
                )}

                {/* Wildcard */}
                {result.wildcard && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">{t('cidr.wildcard')}:</div>
                    <div className="break-all">{result.wildcard}</div>
                  </>
                )}

                <div className="col-span-2 my-2 border-b border-gray-200 dark:border-gray-700"></div>

                {/* Network */}
                {result.network && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">{t('cidr.network')}:</div>
                    <div className="break-all text-blue-600 dark:text-blue-400">
                      {result.network}
                    </div>
                  </>
                )}

                {/* Broadcast */}
                {result.broadcast && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">{t('cidr.broadcast')}:</div>
                    <div className="break-all text-blue-600 dark:text-blue-400">
                      {result.broadcast}
                    </div>
                  </>
                )}

                {/* HostMin */}
                {result.hostMin && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">{t('cidr.hostMin')}:</div>
                    <div className="break-all text-blue-600 dark:text-blue-400">
                      {result.hostMin}
                    </div>
                  </>
                )}

                {/* HostMax */}
                {result.hostMax && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">{t('cidr.hostMax')}:</div>
                    <div className="break-all text-blue-600 dark:text-blue-400">
                      {result.hostMax}
                    </div>
                  </>
                )}

                {/* Hosts/Net */}
                {result.totalHosts && (
                  <>
                    <div className="text-gray-500 dark:text-gray-400">{t('cidr.hostsNet')}:</div>
                    <div className="text-blue-600 dark:text-blue-400">{result.totalHosts}</div>
                  </>
                )}

                {/* Type/Version for references that might be useful */}
                <div className="text-gray-500 dark:text-gray-400">{t('cidr.type')}:</div>
                <div>
                  {result.version} {result.type}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CidrCalculator;
