import { useRef, useState } from 'react'
import { Search, Plus, Upload } from 'lucide-react'
import { type TaskTag, type TaskStatus, type WorkType, type TaskSection } from './types'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface ToolbarProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    filterStatus: TaskStatus | 'all'
    onFilterStatusChange: (status: TaskStatus | 'all') => void
    filterTag: TaskTag | 'all'
    onFilterTagChange: (tag: TaskTag | 'all') => void
    onCreateTask: () => void
    onImportCsv: (tasks: Array<{
        title: string
        description: string
        status: TaskStatus
        workType: WorkType
        tags?: TaskTag[]
        estimatedMinutes?: number | null
        scheduledStart?: string | null
        scheduledEnd?: string | null
        section?: TaskSection
    }>) => void
}

const allTags: TaskTag[] = ['Mail', 'Office', 'Meeting', 'PC', 'Home']

const validStatuses: TaskStatus[] = ['未着手', '進行中', '完了']
const validWorkTypes: WorkType[] = ['検証', 'コード生成', '環境整備']
const validTags: TaskTag[] = ['Mail', 'Office', 'Meeting', 'PC', 'Home']
const validSections: TaskSection[] = ['午前', '午後', '終日']

function parseCsvLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (inQuotes) {
            if (ch === '"' && line[i + 1] === '"') {
                current += '"'
                i++
            } else if (ch === '"') {
                inQuotes = false
            } else {
                current += ch
            }
        } else {
            if (ch === '"') {
                inQuotes = true
            } else if (ch === ',') {
                result.push(current.trim())
                current = ''
            } else {
                current += ch
            }
        }
    }
    result.push(current.trim())
    return result
}

function parseCsv(text: string) {
    const lines = text.split(/\r?\n/).filter((l) => l.trim())
    if (lines.length < 2) return { tasks: [], errors: ['ヘッダーとデータが必要です'] }

    const header = parseCsvLine(lines[0]).map((h) => h.toLowerCase().trim())
    const titleIdx = header.findIndex((h) => h === 'タイトル' || h === 'title')
    if (titleIdx === -1) return { tasks: [], errors: ['「タイトル」列が見つかりません'] }

    const descIdx = header.findIndex((h) => h === '説明' || h === 'description')
    const statusIdx = header.findIndex((h) => h === 'ステータス' || h === 'status')
    const workTypeIdx = header.findIndex((h) => h === '作業内容' || h === 'worktype' || h === '作業')
    const tagsIdx = header.findIndex((h) => h === 'タグ' || h === 'tags')
    const minutesIdx = header.findIndex((h) => h === '見積時間' || h === 'minutes' || h === '時間')
    const startIdx = header.findIndex((h) => h === '開始' || h === 'start')
    const endIdx = header.findIndex((h) => h === '終了' || h === 'end')
    const sectionIdx = header.findIndex((h) => h === 'セクション' || h === 'section')

    const tasks: Array<{
        title: string; description: string; status: TaskStatus; workType: WorkType
        tags?: TaskTag[]; estimatedMinutes?: number | null
        scheduledStart?: string | null; scheduledEnd?: string | null; section?: TaskSection
    }> = []
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i])
        const title = cols[titleIdx]?.trim()
        if (!title) { errors.push(`${i + 1}行目: タイトルが空です`); continue }

        const rawStatus = statusIdx >= 0 ? cols[statusIdx]?.trim() : ''
        const status: TaskStatus = validStatuses.includes(rawStatus as TaskStatus)
            ? rawStatus as TaskStatus : '未着手'

        const rawWorkType = workTypeIdx >= 0 ? cols[workTypeIdx]?.trim() : ''
        const workType: WorkType = validWorkTypes.includes(rawWorkType as WorkType)
            ? rawWorkType as WorkType : 'コード生成'

        const rawTags = tagsIdx >= 0 ? cols[tagsIdx]?.trim() : ''
        const tags: TaskTag[] = rawTags
            ? rawTags.split(/[;|\/]/).map((t) => t.trim()).filter((t): t is TaskTag => validTags.includes(t as TaskTag))
            : []

        const rawMinutes = minutesIdx >= 0 ? cols[minutesIdx]?.trim() : ''
        const estimatedMinutes = rawMinutes ? parseInt(rawMinutes, 10) || null : null

        const rawSection = sectionIdx >= 0 ? cols[sectionIdx]?.trim() : ''
        const section: TaskSection = validSections.includes(rawSection as TaskSection)
            ? rawSection as TaskSection : '終日'

        tasks.push({
            title,
            description: descIdx >= 0 ? cols[descIdx]?.trim() ?? '' : '',
            status,
            workType,
            tags,
            estimatedMinutes,
            scheduledStart: startIdx >= 0 ? cols[startIdx]?.trim() || null : null,
            scheduledEnd: endIdx >= 0 ? cols[endIdx]?.trim() || null : null,
            section,
        })
    }

    return { tasks, errors }
}

export function Toolbar({
    searchQuery,
    onSearchChange,
    filterStatus,
    onFilterStatusChange,
    filterTag,
    onFilterTagChange,
    onCreateTask,
    onImportCsv,
}: ToolbarProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [importMessage, setImportMessage] = useState<string | null>(null)

    const today = new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (ev) => {
            const text = ev.target?.result as string
            const { tasks, errors } = parseCsv(text)

            if (tasks.length > 0) {
                onImportCsv(tasks)
                setImportMessage(`${tasks.length}件のタスクをインポートしました`)
            } else {
                setImportMessage('インポートできるタスクがありません')
            }

            if (errors.length > 0) {
                console.warn('CSV import warnings:', errors)
            }

            setTimeout(() => setImportMessage(null), 3000)
        }
        reader.readAsText(file, 'utf-8')

        e.target.value = ''
    }

    return (
        <div className="toolbar">
            <div className="toolbar-left">
                <div className="toolbar-search">
                    <Search size={14} className="toolbar-search-icon" />
                    <Input
                        placeholder="タスクを検索..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="toolbar-search-input"
                    />
                </div>

                <Select
                    value={filterStatus}
                    onValueChange={(v) => onFilterStatusChange(v as TaskStatus | 'all')}
                >
                    <SelectTrigger className="toolbar-filter-trigger">
                        <SelectValue placeholder="ステータス" />
                    </SelectTrigger>
                    <SelectContent className="toolbar-dropdown">
                        <SelectItem value="all">ステータス: 全て</SelectItem>
                        <SelectItem value="未着手">未着手</SelectItem>
                        <SelectItem value="進行中">進行中</SelectItem>
                        <SelectItem value="完了">完了</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filterTag}
                    onValueChange={(v) => onFilterTagChange(v as TaskTag | 'all')}
                >
                    <SelectTrigger className="toolbar-filter-trigger">
                        <SelectValue placeholder="タグ" />
                    </SelectTrigger>
                    <SelectContent className="toolbar-dropdown">
                        <SelectItem value="all">タグ: 全て</SelectItem>
                        {allTags.map((tag) => (
                            <SelectItem key={tag} value={tag}>
                                {tag}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="toolbar-right">
                {importMessage && (
                    <span className="toolbar-import-message">{importMessage}</span>
                )}
                <span className="toolbar-date">{today}</span>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
                <button
                    className="toolbar-import-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="CSVインポート"
                >
                    <Upload size={14} />
                    <span>CSV</span>
                </button>

                <button className="toolbar-add-btn" onClick={onCreateTask}>
                    <Plus size={15} />
                    <span>追加</span>
                </button>
            </div>
        </div>
    )
}
