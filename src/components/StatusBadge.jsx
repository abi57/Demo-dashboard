import { CheckCircle, XCircle, AlertCircle, WifiOff } from 'lucide-react'

const MAP = {
  confirmed: { cls: 'vio-badge-green',  label: 'Confirmed', Icon: CheckCircle },
  online:    { cls: 'vio-badge-green',  label: 'Online',    Icon: CheckCircle },
  pending:   { cls: 'vio-badge-amber',  label: 'Pending',   Icon: AlertCircle },
  degraded:  { cls: 'vio-badge-amber',  label: 'Degraded',  Icon: AlertCircle },
  warning:   { cls: 'vio-badge-amber',  label: 'Warning',   Icon: AlertCircle },
  alert:     { cls: 'vio-badge-red',    label: 'Alert',     Icon: XCircle     },
  failed:    { cls: 'vio-badge-red',    label: 'Failed',    Icon: XCircle     },
  offline:   { cls: 'vio-badge-grey',   label: 'Offline',   Icon: WifiOff     },
  yes:       { cls: 'vio-badge-green',  label: 'Yes',       Icon: CheckCircle },
  no:        { cls: 'vio-badge-red',    label: 'No',        Icon: XCircle     },
}

export default function StatusBadge({ status, showIcon = true }) {
  const s = MAP[status?.toLowerCase()] ?? { cls: 'vio-badge-grey', label: status ?? '—', Icon: AlertCircle }
  const { cls, label, Icon } = s
  return (
    <span className={`vio-badge ${cls}`}>
      {showIcon && <Icon size={10} />}
      {label}
    </span>
  )
}
