import { useEffect, useRef, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Documents() {
    const { user } = useAuth();

    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchDocuments();
    }, []);

    /**
     * Load documents
     */
    const fetchDocuments = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/documents');

            console.log('Documents API response:', response.data);

            // Laravel returns:
            // {
            //     success: true,
            //     documents: [...]
            // }
            setDocuments(response.data.documents || []);
        } catch (error) {
            console.error('Failed to fetch documents:', error);

            setError(
                error.response?.data?.message ||
                    'Failed to load documents.'
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Upload document
     */
    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            setUploading(true);
            setError('');
            setSuccess('');

            const formData = new FormData();

            // Laravel requires title
            formData.append('title', file.name);

            // Laravel requires file
            formData.append('file', file);

            console.log('Uploading:', {
                title: file.name,
                file: file,
            });

            const response = await api.post(
                '/documents',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Upload response:', response.data);

            // Laravel returns:
            // {
            //     success: true,
            //     message: 'Document uploaded successfully.',
            //     document: {...}
            // }
            const uploadedDocument =
                response.data.document;

            if (uploadedDocument) {
                setDocuments((currentDocuments) => [
                    uploadedDocument,
                    ...currentDocuments,
                ]);
            }

            setSuccess(
                response.data.message ||
                    'Document uploaded successfully.'
            );
        } catch (error) {
            console.error('Upload failed:', error);

            console.error(
                'Upload error response:',
                error.response?.data
            );

            setError(
                error.response?.data?.message ||
                    'Failed to upload document.'
            );
        } finally {
            setUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    /**
     * Download document
     */
    const handleDownload = async (document) => {
        try {
            setError('');
            setSuccess('');

            const response = await api.get(
                `/documents/${document.id}/download`,
                {
                    responseType: 'blob',
                }
            );

            const blob = new Blob([response.data], {
                type:
                    response.headers['content-type'] ||
                    document.file_type ||
                    'application/octet-stream',
            });

            const url = window.URL.createObjectURL(blob);

            const link = window.document.createElement('a');

            link.href = url;

            link.download =
                document.file_name ||
                document.title ||
                'document';

            window.document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);

            setError(
                error.response?.data?.message ||
                    'Failed to download document.'
            );
        }
    };

    /**
     * Delete document
     */
    const handleDelete = async (document) => {
        const documentName =
            document.title ||
            document.file_name ||
            'this document';

        const confirmed = window.confirm(
            `Are you sure you want to delete "${documentName}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeletingId(document.id);
            setError('');
            setSuccess('');

            const response = await api.delete(
                `/documents/${document.id}`
            );

            setDocuments((currentDocuments) =>
                currentDocuments.filter(
                    (item) => item.id !== document.id
                )
            );

            setSuccess(
                response.data.message ||
                    'Document deleted successfully.'
            );
        } catch (error) {
            console.error('Delete failed:', error);

            setError(
                error.response?.data?.message ||
                    'Failed to delete document.'
            );
        } finally {
            setDeletingId(null);
        }
    };

    /**
     * Format file size
     */
    const formatFileSize = (bytes) => {
        if (bytes === null || bytes === undefined) {
            return '-';
        }

        if (bytes < 1024) {
            return `${bytes} B`;
        }

        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }

        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    /**
     * Format date
     */
    const formatDate = (date) => {
        if (!date) {
            return '-';
        }

        return new Date(date).toLocaleString();
    };

    return (
        <div className="documents-page">
            <div className="documents-header">
                <div>
                    <h1>Documents</h1>

                    <p>
                        Access and manage internal company
                        documents.
                    </p>
                </div>

                <div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileChange}
                        disabled={uploading}
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        style={{ display: 'none' }}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        disabled={uploading}
                    >
                        {uploading
                            ? 'Uploading...'
                            : 'Upload Document'}
                    </button>
                </div>
            </div>

            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div className="documents-card">
                {loading ? (
                    <div className="documents-loading">
                        Loading documents...
                    </div>
                ) : documents.length === 0 ? (
                    <div className="documents-empty">
                        No documents found.
                    </div>
                ) : (
                    <div className="documents-table-wrapper">
                        <table className="documents-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Document</th>
                                    <th>Uploaded By</th>
                                    <th>File Type</th>
                                    <th>Size</th>
                                    <th>Uploaded At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {documents.map(
                                    (document, index) => {
                                        const isOwner =
                                            Number(
                                                document.user_id
                                            ) ===
                                            Number(user?.id);

                                        return (
                                            <tr
                                                key={
                                                    document.id
                                                }
                                            >
                                                <td>
                                                    {index + 1}
                                                </td>

                                                <td>
                                                    <strong>
                                                        {document.title ||
                                                            document.file_name ||
                                                            'Untitled Document'}
                                                    </strong>

                                                    {document.file_name && (
                                                        <div
                                                            style={{
                                                                fontSize:
                                                                    '12px',
                                                                opacity: 0.7,
                                                                marginTop:
                                                                    '4px',
                                                            }}
                                                        >
                                                            {
                                                                document.file_name
                                                            }
                                                        </div>
                                                    )}
                                                </td>

                                                <td>
                                                    {document.user
                                                        ?.name ||
                                                        'Unknown'}
                                                </td>

                                                <td>
                                                    {document.file_type ||
                                                        '-'}
                                                </td>

                                                <td>
                                                    {formatFileSize(
                                                        document.file_size
                                                    )}
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        document.created_at
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="document-actions">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDownload(
                                                                    document
                                                                )
                                                            }
                                                        >
                                                            Download
                                                        </button>

                                                        {isOwner && (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        document
                                                                    )
                                                                }
                                                                disabled={
                                                                    deletingId ===
                                                                    document.id
                                                                }
                                                            >
                                                                {deletingId ===
                                                                document.id
                                                                    ? 'Deleting...'
                                                                    : 'Delete'}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}